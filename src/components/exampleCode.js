module.exports = `import tester.Tester;
import javalib.worldimages.*;
import java.awt.Color;

class Foo {
  int a;
  int b;
  int c;
  
  Foo(int a, int b) {
    this.a = a;
    this.b = b;
  }

  int add() {
    return this.a + this.b;
  }

  WorldImage render() {
    return new CircleImage(10, OutlineMode.SOLID, Color.PINK);
  }
}

class ExamplesFoo {
  void testFoo(Tester t) {
    t.checkExpect(new Foo(1, 2).add(), 3);
    t.checkExpect(new Foo(4, 56).add(), 60);
    t.checkExpect(new Foo(1, 2).render(), new CircleImage(10, OutlineMode.SOLID, Color.PINK));
    // Fail
    t.checkExpect(new Foo(1, 2).add(), 4);
  }
}`
