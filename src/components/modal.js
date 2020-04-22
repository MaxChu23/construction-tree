import React, { useCallback } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
`

const ModalWindow = styled.div`
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
`

const ModalContent = styled.div`
  display: flex;
`

const Modal = ({ open, setOpen }) => {

  const closeModal = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  if (!open) return null

  return (
    <Container>
      <Backdrop onClick={closeModal} />
      <ModalWindow>
        <ModalContent>
          {"sdf"}
        </ModalContent>
      </ModalWindow>
    </Container>
  )
}

export default Modal
