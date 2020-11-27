import React, { Children } from 'react'

import LinkedList from '../../models/LinkedList'
import Node from '../../models/Node'
import Slide from '../../models/Slide'
import getDocument from '../../shims/document'

import './Carousel.scss'

declare var ResizeObserver: any

const classes = {
  itemCurrent: 'x-current',
  itemPast: 'x-prev',
  itemFuture: 'x-next'
}

const classRemover = new RegExp(
  '\\b(' +
    classes.itemCurrent +
    '|' +
    classes.itemPast +
    '|' +
    classes.itemFuture +
    ')(.*?)(\\s|$)',
  'g'
)

const whiteSpaceRemover = new RegExp('\\s\\s+', 'g')

// const noop = () => {}

interface Props {
  cellSize?: number
  autoPlay?: boolean
  children?: React.ReactChild[]
  useKeyboardArrows?: boolean
  onChange?: (node: Node) => void
}

interface State {
  currentIndex: number
  initialized: boolean
}

export default class Carousel extends React.Component<Props, State> {
  private carouselWrapperRef?: HTMLDivElement
  private sceneRef?: HTMLDivElement

  list = new LinkedList()
  theta: number = 0
  radius: number = 0
  cellsCount: number = 0

  constructor(props: Props) {
    super(props)

    this.state = {
      currentIndex: 0,
      initialized: false
    }

    this.buildList()
  }

  componentDidMount() {
    this.setState({ initialized: true })
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.initialized && this.state.initialized) {
      this.calculateDimension()
      this.setResizeListener()
      this.changeCarousel()
    }
  }

  componentWillUnmount() {
    this.destroyCarousel()
  }

  buildList() {
    if (!this.props.children) return

    Children.map(this.props.children, (item: any, index) => {
      const slide = new Slide(index, item.props.data, React.createRef())
      this.list.push(slide)
    })

    this.list.connectTailWithHead()
  }

  calculateDimension() {
    if (!this.sceneRef) return

    const { width, height } = this.sceneRef.getBoundingClientRect()

    this.cellsCount = Children.count(this.props.children) || 0
    this.theta = 360 / this.cellsCount
    this.radius = Math.round(width / 2 / Math.tan(Math.PI / this.cellsCount))
  }

  setResizeListener() {
    const resizeObserver = new ResizeObserver((entries: any) => {
      entries.forEach(() => {
        this.calculateDimension()
        this.changeCarousel()
        this.forceUpdate()
      })
    })

    resizeObserver.observe(this.sceneRef)
  }

  changeCarousel() {
    if (!this.list.length) return

    let currentNode = this.list.getNodeAtIndex(0)
    while (true) {
      const cellAngle = this.theta * currentNode.value.id
      currentNode.value.element.style.transform =
        'rotateY' + '(' + cellAngle + 'deg) translateZ(' + this.radius + 'px)'

      if (currentNode.value.id === this.list.length - 1) break

      currentNode = currentNode.next
    }

    this.rotateCarousel()
  }

  moveRight = () => {
    this.setState(
      function (state, props) {
        return {
          currentIndex: state.currentIndex + 1
        }
      },
      () => {
        this.rotateCarousel()
      }
    )
  }

  moveLeft = () => {
    this.setState(
      function (state, props) {
        return {
          currentIndex: state.currentIndex - 1
        }
      },
      () => {
        this.rotateCarousel()
      }
    )
  }

  bindEvents() {
    if (this.props.useKeyboardArrows) {
      getDocument().addEventListener('keydown', this.navigateWithKeyboard)
    }
  }

  navigateWithKeyboard() {}

  destroyCarousel() {}

  rotateCarousel() {
    if (!this.carouselWrapperRef) return

    const angle = this.theta * this.state.currentIndex * -1
    this.carouselWrapperRef.style.transform =
      'translateZ(' + -this.radius + 'px) ' + 'rotateY' + '(' + angle + 'deg)'

    //fix initial animation
    setTimeout(
      () => (this.carouselWrapperRef.style.transition = 'transform 1s'),
      0
    )

    this.updateClassList()
    this.props.onChange(this.getCurrentNode())
  }

  setSceneRef = (node: HTMLDivElement) => {
    this.sceneRef = node
  }

  setCarouselWrapperRef = (node: HTMLDivElement) => {
    this.carouselWrapperRef = node
  }

  setItemRef = (element: HTMLElement, index: number) => {
    const node = this.list.getNodeAtIndex(index)
    node.value.element = element
  }

  getActualIndex() {
    return Math.sign(this.state.currentIndex) < 0
      ? this.list.length - Math.abs(this.state.currentIndex)
      : this.state.currentIndex % this.list.length
  }

  getCurrentNode() {
    const idx = this.getActualIndex()

    return this.list.getNodeAtIndex(idx)
  }

  handleClickItem(node: Node, index: number) {}

  handleLeftControlClick = () => {
    this.moveLeft()
  }

  handleRightControlClick = () => {
    this.moveRight()
  }

  removeExtraClasses(element: any) {
    return (element.className = element.className
      .replace(classRemover, '')
      .replace(whiteSpaceRemover, ' '))
  }

  updateClassList() {
    const centerNode = this.getCurrentNode()
    const centerElement = centerNode.value.element

    this.removeExtraClasses(centerElement)
    centerElement.classList.add('x-current')

    let counter = 0
    const max = Math.floor(this.list.length / 2)
    let currentNode = centerNode
    while (counter < max) {
      const element = currentNode.next.value.element
      this.removeExtraClasses(element)
      element.classList.add('x-next-' + counter)
      currentNode = currentNode.next
      counter++
    }

    counter = 0
    currentNode = centerNode
    while (counter < max) {
      const element = currentNode.prev.value.element
      this.removeExtraClasses(element)
      element.classList.add('x-prev-' + counter)
      currentNode = currentNode.prev
      counter++
    }
  }

  //RENDER

  renderItems() {
    if (!this.props.children || !this.sceneRef) return

    const { width, height } = this.sceneRef.getBoundingClientRect()

    return Children.map(this.props.children, (node, index) => {
      const slideProps = {
        ref: (element: HTMLDivElement) => this.setItemRef(element, index),
        onClick: this.handleClickItem.bind(this, node, index),
        className: 'x-carousel__slide',
        style: { width: width + 'px', height: height + 'px' }
      }

      return <div {...slideProps}>{node}</div>
    })
  }

  render() {
    return (
      <div className='x-scene' ref={this.setSceneRef}>
        <div className='x-carousel' ref={this.setCarouselWrapperRef}>
          {this.renderItems()}
        </div>
        <div
          className='x-scene-lcontrol'
          onClick={this.handleLeftControlClick}
        ></div>
        <div
          className='x-scene-rcontrol'
          onClick={this.handleRightControlClick}
        ></div>
      </div>
    )
  }
}
