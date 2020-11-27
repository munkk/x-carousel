import React, { Children } from 'react'

import './Slide.scss'

interface Props {
  data: any
}

interface State {}

export default class Slide extends React.Component<Props, State> {
  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}
