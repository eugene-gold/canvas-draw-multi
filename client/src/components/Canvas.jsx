import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss'
import {observer} from "mobx-react-lite";
import Brush from "../tools/Brush";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";

const Canvas = observer(() => {

    const canvasRef= useRef()
    const userNameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(()=> {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(r => {
                const img = new Image()
                img.src = r.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.stroke()
                }
            })
    }, [])

    useEffect(()=> {
        if(canvasState.userName) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocketId(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log('connection starts')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.userName,
                    method: 'connection'
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                // eslint-disable-next-line default-case
                switch (msg.method) {
                    case "connection":
                        console.log(`${msg.username} joined`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }

    }, [canvasState.userName])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        // eslint-disable-next-line default-case
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color )
                break
            case "finish":
                ctx.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const connectionHandler = () => {
        canvasState.setUserName(userNameRef.current.value)
        setModal(false)
    }
    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type='text' ref={userNameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas
                onMouseDown={()=> mouseDownHandler() }
                ref={canvasRef}
                width={600}
                height={400}
            />
        </div>
    );
});

export default Canvas;