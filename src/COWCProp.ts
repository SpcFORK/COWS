export class COWCProp<p = any> {
  // @head
  static self = this;
  self = this;
  p = Reflect.getPrototypeOf(this) as p;
}
