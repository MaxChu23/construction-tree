import ButtonBase from './button-base'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  padding: 20px;
`

const Content = styled.div`
  box-shadow: 0px 10px 22px rgba(0, 40, 80, 0.2);
  padding: 40px;
  border-radius: 12px;
  background: #fff;
  z-index: 10;
  transform: none;
  opacity: 1;
  transition: all 0.4s 0.1s ease-in;
  transform-origin: 0px 100%;

  ${({ submitted }) =>
    submitted &&
    `
    transform: translate(12%,-70%) rotate(10deg);
    opacity: 0;
  `}

  @media (max-width: 960px) {
    padding: 20px;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.3s;
  ${({ submitted }) => submitted && 'opacity: 0;'}
`

const Title = styled.h1`
  color: #333;
  text-align: center;
`

const Description = styled.p`
  color: #333;
  text-align: center;
  font-size: 16px;
  margin-bottom: 40px;
  margin-top: 0px;
`

const SuccessSign = styled.div`
  color: #333;
  font-size: 22px;
  font-weight: 700;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  animation: ${({ submitted }) => (submitted ? 'success-sign 1.2s 0.6s' : 'none')};
  user-select: none;

  @keyframes success-sign {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`

const Input = styled.input`
  -webkit-appearance: none;
  width: 320px;
  text-align: center;
  border-radius: 14px;
  border: 1px solid #ddd;
  background: #fff;
  font-weight: 700;
  font-size: 18px;
  outline: none;
  padding: 8px 20px;
  width: 100%;
  transition: all 0.2s;
  color: #333;

  &:focus {
    border-color: #59d;
    border-radius: 6px;
  }

  ::placeholder {
    color: #9aa;
    font-weight: normal;
  }
`

const BigButton = styled(ButtonBase)`
  position: relative;
  margin-top: 25px;
  padding: 8px 40px;

  color: #fff;
  background: linear-gradient(45deg, #3496fc, #2ae4e5);
  border-radius: 8px;

  font-size: 18px;
  letter-spacing: 1px;
`

const DecorativeRectangle = styled.div`
  position: absolute;
  top: 0;
  left: 20vw;
  transform: rotate(-45deg);
  width: 60vw;
  height: 130vw;
  background: linear-gradient(110deg, #56ade6, #45ffdd7a);
  z-index: -1;
  transform-origin: 0px 0px;
  transition: all 1.3s;

  ${({ submitted }) => (submitted ? 'transform: rotate(-45deg) translateX(100%);' : '')}

  @media (max-width: 960px) {
    left: 0;
    width: 100vw;
    height: 200vw;
  }
`

const DecorativeRectabgle2 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-45deg);
  width: 80vw;
  height: 160vw;
  background: linear-gradient(45deg, #56ade6, #45ffdd7a);
  z-index: -1;
  transform-origin: 0px 0px;
  transition: transform 1.3s, opacity 0.9s 0.4s;

  ${({ submitted }) => (submitted ? 'transform: rotate(-45deg) translateX(-100%); opacity: 0;' : '')}

  @media (max-width: 960px) {
    left: -30vw;
    width: 170vw;
    height: 300vw;
  }
`

const FlyingFigure = styled.div`
  position: absolute;
  background: linear-gradient(35deg, #fff5 30%, #fff0 70%);
  z-index: 0;
  mix-blend-mode: overlay;

  ${({ figure }) => `
    border-radius: 50%;
    transform-origin: 10% 80%;
    top: ${figure.top}vh;
    right: ${figure.right}vw;
    height: ${figure.height}vw;
    width: ${figure.width}vw;
    animation: flying-figure-${figure.id} ${figure.speed}s infinite linear;
    @keyframes flying-figure-${figure.id} {
      0% {
        transform: rotate(${-figure.rotation}deg);
      }
      100% {
        transform: rotate(${360 - figure.rotation}deg);
      }
    }
  `}
`

const Error = styled.p`
  color: #f65;
  margin: 10px 0;
`

const circles = [
  { id: 1, right: 10, top: 10, height: 20, width: 20, rotation: 100, speed: 50 },
  { id: 2, right: 30, top: 7, height: 18, width: 18, rotation: 200, speed: 80 },
  { id: 3, right: -2, top: 20, height: 30, width: 30, rotation: 0, speed: 50 },
  { id: 4, right: 5, top: 5, height: 10, width: 10, rotation: 0, speed: 50 },
]

const Decoration = ({ submitted }) => {
  const decorativeCircles = useMemo(() => circles, [])

  return (
    <div>
      <DecorativeRectangle submitted={submitted} />
      <DecorativeRectabgle2 submitted={submitted} />
      {decorativeCircles.map(figure => (
        <FlyingFigure figure={figure} key={figure.id} />
      ))}
    </div>
  )
}

const BlankState = ({ setTreeData }) => {
  const [projectName, setProjectName] = useState('')
  const [hasError, setHasError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const animationTimeout = useRef(null)

  const onNameChange = useCallback(event => {
    setProjectName(event.target.value)
  }, [])

  const createNewTree = useCallback(() => {
    const newTreeData = [{ id: 1, type: 'Project', name: projectName, expanded: true, properties: [], items: [] }]
    setTreeData(newTreeData)
  }, [projectName, setTreeData])

  const onSubmit = useCallback(
    event => {
      event.preventDefault()
      if (projectName === '') {
        setHasError(true)
        return
      }
      setSubmitted(true)
      animationTimeout.current = setTimeout(() => {
        createNewTree()
      }, 1800)
    },
    [projectName, createNewTree]
  )

  useEffect(() => () => clearTimeout(animationTimeout.current), [])

  return (
    <Container>
      <Decoration submitted={submitted} />
      <SuccessSign submitted={submitted}>{'Have fun! :)'}</SuccessSign>
      <Content submitted={submitted}>
        <Form action="" onSubmit={onSubmit} submitted={submitted}>
          <Title>{'New project'}</Title>
          <Description>{'Create a new project for your construction site from scratch!'}</Description>
          <Input autoFocus onChange={onNameChange} placeholder="Choose a cool name" value={projectName} />
          {hasError && <Error>{'Project name should not be empty!'}</Error>}
          <BigButton disabled={submitted} type="submit">
            {'Create'}
          </BigButton>
        </Form>
      </Content>
    </Container>
  )
}

export default BlankState
