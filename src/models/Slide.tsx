export default class Slide {
  id: number = null
  item: any = null
  element: any = null

  constructor(id: number, item: any, element: any) {
    this.id = id
    this.item = item
    this.element = element
  }
}
