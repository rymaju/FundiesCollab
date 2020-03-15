const javaCode = `
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import tester.Tester;

// represent a Huffman encoding tree 
class Huffman {
  IHuffmanTree tree;

  // Constructor with given AL<string> alos and AL<Integer> aloi
  // throw error if the two AL's size not equal
  // or the size is smaller than 2
  Huffman(ArrayList<String> alos, ArrayList<Integer> aloi) {
    if (alos.size() != aloi.size()) {
      throw new IllegalArgumentException("length not equal!");
    } else if (alos.size() < 2) {
      throw new IllegalArgumentException("pointless encoding!");
    }
    ArrayList<IHuffmanTree> forest = this.merge(alos, aloi);
    this.sort(forest);
    tree = this.trimForest(forest);
  }

  // sort the given AL of HuffmanTree, smallest to largest
  void sort(ArrayList<IHuffmanTree> aloh) {
    for (int index = aloh.size() - 1; index >= 0; index -= 1) {
      this.insert(index, aloh);
    }
  }

  // insert the given node at given index as deep as possible
  void insert(int start, ArrayList<IHuffmanTree> aloh) {
    for (int index = start; index < aloh.size() - 1; index += 1) {
      if (aloh.get(index).compareTo(aloh.get(index + 1)) >= 0) {
        swap(aloh, index, index + 1);
      }
    }
  }

  // swap the elements by index in given ArrayList of HuffmanTree
  void swap(ArrayList<IHuffmanTree> aloh, int src, int dest) {
    IHuffmanTree temp = aloh.get(src);
    aloh.set(src, aloh.get(dest));
    aloh.set(dest, temp);
  }

  // Effect: all values in src are added to the list dest
  // adds all the items of the second list into the first
  void addAll(ArrayList<Boolean> dest, ArrayList<Boolean> src) {
    for (Boolean bool : src) {
      dest.add(bool);
    }
  }

  // merge the ArrayList of Integer and ArrayList of String to a forest of
  // HuffmanTrees
  ArrayList<IHuffmanTree> merge(ArrayList<String> alos, ArrayList<Integer> aloi) {
    ArrayList<IHuffmanTree> aloh = new ArrayList<IHuffmanTree>();
    Iterator<String> itrS = alos.iterator();
    Iterator<Integer> itrI = aloi.iterator();
    // termination: we always call next() on every iteration for both iterators,
    // so eventually, we will empty both iterators
    while (itrS.hasNext() && itrI.hasNext()) {
      aloh.add(new HuffmanLeaf(itrI.next(), itrS.next()));
    }
    return aloh;
  }

  // trim the given ArrayList forest of HuffmanTrees into a single tree
  IHuffmanTree trimForest(ArrayList<IHuffmanTree> aloh) {
    // termination: this will terminate since after every operation,
    // since after every iteration, two nodes are converted into one
    // so the size decreases by 1 each time.
    while (aloh.size() > 1) {
      IHuffmanTree first = aloh.remove(0);
      IHuffmanTree second = aloh.remove(0);
      IHuffmanTree combined = new HuffmanNode(first.getFreq() + second.getFreq(), first, second);
      aloh.add(0, combined);
      this.insert(0, aloh);
    }
    return aloh.get(0);
  }

  // encode the given string with huffman tree
  // where 0 is represented by false and 1 by true.
  // throw error if the string contains any character not in the alphabet
  ArrayList<Boolean> encode(String str) {

    ArrayList<Boolean> ans = new ArrayList<Boolean>();

    for (int index = 0; index < str.length(); index += 1) {
      String target = str.substring(index, index + 1);
      ArrayList<Boolean> charCode = this.tree.encode(target);
      addAll(ans, charCode);
    }
    return ans;
  }

  // decode the given ArrayList<Boolean>,
  // return "?" if the method terminated before reaching an end
  String decode(ArrayList<Boolean> code) {
    String ans = "";
    ArrayList<Boolean> copy = new ArrayList<Boolean>();

    for (Boolean bool : code) {
      copy.add(bool);
    }
    // terminates because we always remove at least one element from code if it has
    // any
    while (copy.size() > 0) {
      ans += this.tree.decode(copy);
    }
    return ans;
  }

}

// represent a HuffmanTree
interface IHuffmanTree {
  // return the frequencies of a node
  int getFreq();

  // compare the frequency with given node
  int compareTo(IHuffmanTree other);

  // Encode the given single letter string with this tree
  ArrayList<Boolean> encode(String target);

  // determine if this given string can be encoded
  // Effect: add true to given ArrayList if it goes left, false if it goes right
  boolean startEncode(ArrayList<Boolean> encoding, String target);

  // decode the given string with this tree
  String decode(ArrayList<Boolean> code);

}

// An abstract representation of a HuffmanNode
abstract class AHuffmanNode implements IHuffmanTree {
  int freq;

  // Constructor
  AHuffmanNode(int freq) {
    this.freq = freq;
  }

  // return the frequency of this node
  public int getFreq() {
    return this.freq;
  }

  // compare the frequency between two node, return the difference by
  // Subtracting other's frequency
  public int compareTo(IHuffmanTree other) {
    return this.getFreq() - other.getFreq();
  }
}

// represent a node in the Huffman tree
class HuffmanNode extends AHuffmanNode {
  IHuffmanTree left;
  IHuffmanTree right;

  // Constructor
  HuffmanNode(int freq, IHuffmanTree left, IHuffmanTree right) {
    super(freq);
    this.left = left;
    this.right = right;
  }

  // encode given letter with this huffmantree
  // throw an error if it given can not be encoded
  public ArrayList<Boolean> encode(String target) {

    ArrayList<Boolean> ans = new ArrayList<Boolean>();
    boolean successfulEncoding = this.startEncode(ans, target);

    if (!successfulEncoding) {
      throw new IllegalArgumentException("Tried to encode " + target + " but that is not part of the language.");
    }

    return ans;
  }

  // Effect: adds the path to the encoding to the given list, if successful
  // returns if it is possible to encode the target string from this node
  public boolean startEncode(ArrayList<Boolean> encoding, String target) {
    if (this.left.startEncode(encoding, target)) {
      encoding.add(0, false);
      return true;
    } else if (this.right.startEncode(encoding, target)) {
      encoding.add(0, true);
      return true;
    } else {
      return false;
    }

  }

  // decode the given ArrayList<Boolean>,
  // return ? if the method terminated before reaching a leaf node
  public String decode(ArrayList<Boolean> code) {
    if (code.isEmpty()) {
      return "?";
    }

    boolean direction = code.remove(0);
    if (direction) {
      return this.right.decode(code);
    } else {
      return this.left.decode(code);
    }
  }

}

// represent a leaf in HuffmanTree
class HuffmanLeaf extends AHuffmanNode {
  String character;

  // Constructor
  HuffmanLeaf(int freq, String character) {
    super(freq);
    this.character = character;
  }

  // cannot start encoding letter from a leaf,
  // just return empty list
  public ArrayList<Boolean> encode(String target) {
    return new ArrayList<Boolean>();
  }

  // determine if given target letter is on the correct end
  public boolean startEncode(ArrayList<Boolean> encoding, String target) {
    return this.character.equals(target);

  }

  // return the character in this leaf, since the decoder has reach an end
  public String decode(ArrayList<Boolean> code) {
    return this.character;
  }
}

// examples and test
class ExamplesHuffman {
  ArrayList<Integer> aloi;
  ArrayList<Integer> aloi2;
  ArrayList<String> alos;
  ArrayList<String> alos2;
  Huffman huff;
  ArrayList<IHuffmanTree> aloh;
  ArrayList<IHuffmanTree> aloh2;

  // initialize all test data
  void initial() {
    aloi = new ArrayList<Integer>(Arrays.asList(12, 45, 5, 13, 9, 16));
    alos = new ArrayList<String>(Arrays.asList("a", "b", "c", "d", "e", "f"));
    aloi2 = new ArrayList<Integer>(Arrays.asList(12, 45));
    alos2 = new ArrayList<String>(Arrays.asList("a", "b"));
    aloh = new ArrayList<IHuffmanTree>();
    aloh.add(new HuffmanLeaf(12, "a"));
    aloh.add(new HuffmanLeaf(45, "b"));
    aloh.add(new HuffmanLeaf(5, "c"));
    aloh.add(new HuffmanLeaf(13, "d"));
    aloh.add(new HuffmanLeaf(9, "e"));
    aloh.add(new HuffmanLeaf(16, "f"));
    huff = new Huffman(alos, aloi);
    aloh2 = new ArrayList<IHuffmanTree>();
    aloh2.add(new HuffmanLeaf(12, "a"));
    aloh2.add(new HuffmanLeaf(45, "b"));
  }

  // test the exception in constructor
  void testConstructorFail(Tester t) {
    this.initial();
    t.checkConstructorException(new IllegalArgumentException("length not equal!"), "Huffman", aloi, alos2);
    aloi2.remove(0);
    alos2.remove(0);
    t.checkConstructorException(new IllegalArgumentException("pointless encoding!"), "Huffman", aloi2, alos2);
  }

  // test merge
  void testMerge(Tester t) {
    this.initial();
    t.checkExpect(huff.merge(alos, aloi), aloh);
    t.checkExpect(huff.merge(alos2, aloi2), aloh2);
  }

  // test sort
  void testSort(Tester t) {
    this.initial();
    huff.sort(aloh2);
    ArrayList<IHuffmanTree> sorted2 = new ArrayList<IHuffmanTree>();
    sorted2.add(new HuffmanLeaf(12, "a"));
    sorted2.add(new HuffmanLeaf(45, "b"));
    t.checkExpect(aloh2, sorted2);
    ArrayList<IHuffmanTree> sorted1 = new ArrayList<IHuffmanTree>();
    sorted1.add(new HuffmanLeaf(5, "c"));
    sorted1.add(new HuffmanLeaf(9, "e"));
    sorted1.add(new HuffmanLeaf(12, "a"));
    sorted1.add(new HuffmanLeaf(13, "d"));
    sorted1.add(new HuffmanLeaf(16, "f"));
    sorted1.add(new HuffmanLeaf(45, "b"));
    huff.sort(aloh);
    t.checkExpect(aloh, sorted1);
  }

  // test insert
  void testInsert(Tester t) {
    this.initial();
    aloh2.add(new HuffmanLeaf(13, "d"));
    ArrayList<IHuffmanTree> sorted2 = new ArrayList<IHuffmanTree>();
    sorted2.add(new HuffmanLeaf(12, "a"));
    sorted2.add(new HuffmanLeaf(13, "d"));
    sorted2.add(new HuffmanLeaf(45, "b"));
    huff.insert(0, aloh2);
    t.checkExpect(aloh2, sorted2);
    aloh2.add(1, new HuffmanLeaf(93, "w"));
    sorted2.add(new HuffmanLeaf(93, "w"));
    huff.insert(1, aloh2);
    t.checkExpect(aloh2, sorted2);
  }

  // test swap
  void testSwap(Tester t) {
    this.initial();
    ArrayList<IHuffmanTree> sorted2 = new ArrayList<IHuffmanTree>();
    sorted2.add(new HuffmanLeaf(45, "b"));
    sorted2.add(new HuffmanLeaf(12, "a"));
    huff.swap(aloh2, 0, 1);
    t.checkExpect(aloh2, sorted2);
    ArrayList<IHuffmanTree> sorted3 = new ArrayList<IHuffmanTree>();
    sorted3.add(new HuffmanLeaf(12, "a"));
    sorted3.add(new HuffmanLeaf(45, "b"));
    huff.swap(aloh2, 0, 1);
    t.checkExpect(aloh2, sorted3);
  }

  // test trimForest
  void testTrimForest(Tester t) {
    this.initial();
    t.checkExpect(huff.trimForest(aloh2), new HuffmanNode(57, new HuffmanLeaf(12, "a"), new HuffmanLeaf(45, "b")));
    huff.sort(aloh);
    t.checkExpect(huff.trimForest(aloh),
        new HuffmanNode(100, new HuffmanLeaf(45, "b"),
            new HuffmanNode(55, new HuffmanNode(25, new HuffmanLeaf(12, "a"), new HuffmanLeaf(13, "d")),
                new HuffmanNode(30, new HuffmanNode(14, new HuffmanLeaf(5, "c"), new HuffmanLeaf(9, "e")),
                    new HuffmanLeaf(16, "f")))));
    this.initial();
    aloh2.add(new HuffmanLeaf(5, "c"));
    huff.sort(aloh2);
    t.checkExpect(huff.trimForest(aloh2), new HuffmanNode(62,
        new HuffmanNode(17, new HuffmanLeaf(5, "c"), new HuffmanLeaf(12, "a")), new HuffmanLeaf(45, "b")));

  }

  // test encode
  void testEncode(Tester t) {
    this.initial();
    ArrayList<Boolean> test1 = new ArrayList<Boolean>(Arrays.asList());
    ArrayList<Boolean> test2 = new ArrayList<Boolean>(Arrays.asList(false, false, false));
    ArrayList<Boolean> test3 = new ArrayList<Boolean>(
        Arrays.asList(true, true, false, true, false, true, false, false));
    // encode in Huffman
    t.checkExpect(huff.encode(""), test1);
    t.checkExpect(huff.encode("eba"), test3);
    t.checkExpect(huff.encode("bbb"), test2);
    t.checkException(new IllegalArgumentException("Tried to encode w but that is not part of the language."), huff,
        "encode", "bw");

    ArrayList<Boolean> test4 = new ArrayList<Boolean>(Arrays.asList(false));
    ArrayList<Boolean> test5 = new ArrayList<Boolean>(Arrays.asList(true, true, false, true));
    // encode in HuffmanTree
    t.checkExpect(huff.tree.encode("b"), test4);
    t.checkExpect(huff.tree.encode("e"), test5);
    t.checkException(new IllegalArgumentException("Tried to encode w but that is not part of the language."), huff.tree,
        "encode", "w");

    // test for startEncode
    t.checkExpect(huff.tree.startEncode(test1, "w"), false);
    t.checkExpect(huff.tree.startEncode(test1, "e"), true);
    t.checkExpect(test1, test5);
  }

  // test decode
  void testDecode(Tester t) {
    this.initial();
    ArrayList<Boolean> test1 = new ArrayList<Boolean>(Arrays.asList());
    ArrayList<Boolean> test2 = new ArrayList<Boolean>(Arrays.asList(false, false, false));
    ArrayList<Boolean> test3 = new ArrayList<Boolean>(
        Arrays.asList(true, true, false, true, false, true, false, false));
    ArrayList<Boolean> test4 = new ArrayList<Boolean>(
        Arrays.asList(true, true, false, true, false, true, false, false, true));
    // decode in Huffman
    t.checkExpect(huff.decode(test1), "");
    t.checkExpect(huff.decode(test2), "bbb");
    t.checkExpect(huff.decode(test3), "eba");
    t.checkExpect(huff.decode(test4), "eba?");

    // decode in HuffmanTree
    t.checkExpect(huff.tree.decode(test1), "?");
    t.checkExpect(huff.tree.decode(test2), "b");
    t.checkExpect(huff.tree.decode(test3), "e");
  }

  // test compareTo
  void testCompareTo(Tester t) {
    this.initial();
    t.checkExpect(aloh.get(0).compareTo(aloh.get(1)), -33);
    t.checkExpect(aloh.get(3).compareTo(aloh.get(2)), 8);
    t.checkExpect(aloh.get(3).compareTo(aloh.get(3)), 0);
  }

  // test getFreq
  void testGetFreq(Tester t) {
    this.initial();
    t.checkExpect(aloh.get(0).getFreq(), 12);
    t.checkExpect(aloh.get(1).getFreq(), 45);
  }

}

`
module.exports = javaCode
