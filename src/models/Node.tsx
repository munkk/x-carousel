export default class Node {
  value: any = null
  prev: any = null
  next: any = null

  constructor(value: any) {
    this.value = value
    this.prev = null
    this.next = null
  }
}
