import React from 'react'

import { Carousel, Slide } from 'react-x-carousel'

import 'react-x-carousel/dist/index.css'
import Image1 from './assets/cat-1.jpg'
import Image2 from './assets/cat-2.jpg'
import Image3 from './assets/cat-3.jpg'
import Image4 from './assets/cat-4.jpg'
import Image5 from './assets/cat-5.jpg'
import Image6 from './assets/cat-6.jpg'
import Image7 from './assets/cat-7.jpg'
import Image8 from './assets/cat-8.jpg'

const items = [
  {
    name: 'Charlie',
    weight: '3.6',
    image: Image1
  },
  {
    name: 'Oscar',
    weight: '4.0',
    image: Image2
  },
  {
    name: 'Alfie',
    weight: '7.2',
    image: Image3
  },
  {
    name: 'Max',
    weight: '3.8',
    image: Image4
  },
  {
    name: 'Milo',
    weight: '5.3',
    image: Image5
  },
  {
    name: 'Jasper',
    weight: '4.1',
    image: Image6
  },
  {
    name: 'George',
    weight: '3.0',
    image: Image7
  },
  {
    name: 'Leo',
    weight: '3.9',
    image: Image8
  }
]

function App() {
  const handleChange = function (node: any) {
    console.log(node)
  }

  return (
    <div className='App'>
      <div style={{ width: '40%', height: '400px', margin: '200px auto 0' }}>
        <Carousel onChange={handleChange}>
          {items.map((item, idx) => {
            return (
              <Slide data={item} key={idx}>
                <img src={item.image} alt='space' />
              </Slide>
            )
          })}
        </Carousel>
      </div>
    </div>
  )
}

export default App
