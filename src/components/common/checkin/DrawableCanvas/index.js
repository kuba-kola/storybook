import React, { Component } from "react";
import {
  number, func, bool, string,
} from "prop-types";

import styles from "./styles.module.scss";

class DrawableCanvas extends Component {
  state = {
    isDrawing: false,
    x: 0,
    y: 0,
  };

  componentDidMount() {
    window.clearSignature = this.clearCanvas;
  }

  setCanvasRef = (canvas) => {
    if (canvas) {
      this.canvasContext = canvas.getContext("2d");
      this.canvasContext.lineWidth = this.props.lineWidth;
    }
  };

  isEnabled = () => !this.props.disabled && this.state.isDrawing;

  // Mouse drawing logic is present only for developent and testing purposes
  startMouseDrawing = (event) => {
    const canvasRect = this.canvasContext.canvas.getBoundingClientRect();
    this.setState({
      isDrawing: true,
      x: event.clientX - canvasRect.x,
      y: event.clientY - canvasRect.y,
    });
  };

  drawMouseStroke = (event) => {
    const canvasRect = this.canvasContext.canvas.getBoundingClientRect();
    const newX = event.clientX - canvasRect.x;
    const newY = event.clientY - canvasRect.y;

    this.canvasContext.moveTo(this.state.x, this.state.y);
    this.canvasContext.lineTo(newX, newY);
    this.canvasContext.stroke();

    this.setState({ x: newX, y: newY });
  };

  stopMouseDrawing = () => {
    this.setState({ isDrawing: false });
    this.props.onUpdateContent(this.canvasContext.canvas.toDataURL());
  };

  startDrawing = (event) => {
    this.props.onDrawStart();
    const canvasRect = this.canvasContext.canvas.getBoundingClientRect();
    this.setState({
      isDrawing: true,
      x: event.changedTouches[0].clientX - canvasRect.left,
      y: event.changedTouches[0].clientY - canvasRect.top,
    });
  };

  drawStroke = (event) => {
    const canvasRect = this.canvasContext.canvas.getBoundingClientRect();
    const newX = event.changedTouches[0].clientX - canvasRect.left;
    const newY = event.changedTouches[0].clientY - canvasRect.top;

    this.canvasContext.moveTo(this.state.x, this.state.y);
    this.canvasContext.lineTo(newX, newY);
    this.canvasContext.stroke();

    this.setState({ x: newX, y: newY });
  };

  stopDrawing = () => {
    this.setState({ isDrawing: false });
    this.props.onUpdateContent(this.canvasContext.canvas.toDataURL());
  };

  clearCanvas = () => {
    const ctx = this.canvasContext;
    ctx.beginPath();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.props.onUpdateContent(null);
  };

  render() {
    const {
      width, height, disabled, signature,
    } = this.props;

    return disabled ? (
      <img alt="signature" src={signature} />
    ) : (
      <canvas
        className={styles.canvas}
        ref={this.setCanvasRef}
        width={width}
        height={height}
        onMouseDown={this.startMouseDrawing}
        onMouseMove={this.isEnabled() ? this.drawMouseStroke : null}
        onMouseUp={this.stopMouseDrawing}
        onTouchStart={this.startDrawing}
        onTouchEnd={this.stopDrawing}
        onTouchMove={this.isEnabled() ? this.drawStroke : null}
      />
    );
  }
}

DrawableCanvas.propTypes = {
  width: number,
  height: number,
  lineWidth: number,
  disabled: bool,
  signature: string,
  onUpdateContent: func,
  onDrawStart: func,
};

DrawableCanvas.defaultProps = {
  width: 400,
  height: 200,
  lineWidth: 1,
  signature: null,
  disabled: false,
  onUpdateContent: () => null,
  onDrawStart: () => null,
};

export default DrawableCanvas;
