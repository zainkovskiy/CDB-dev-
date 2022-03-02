import React, { Component } from 'react';

import './DragAndDrop.css';

export class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.dragRef = React.createRef();
  }
  state = {
    dragIn: false
  }
  dragenter = (e) =>{
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "#f1f8ff";
    }
    this.setState({dragIn: true});
  }
  dragover = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "#f1f8ff";
    }
    this.setState({dragIn: true});
  }
  dragleave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('file')) {
      e.target.style.background = "";
    }
    this.setState({dragIn: false});
  }
  drop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.sendFiles(e.dataTransfer.files, e.target.dataset.container);
    this.setState({dragIn: false});
  }
  handlerInputFiles = (event) => {
    event.target.parentElement.style.background = "#f1f8ff";
    this.props.sendFiles(event.target.files, event.target.name);
  }

  render() {
    const { container, title } = this.props;
    return (<div data-container={container} className="file" ref={this.dragRef}>
              <input
                name={container}
                className="file__input"
                id={`file_${container}`}
                type="file"
                multiple
                onChange={this.handlerInputFiles}
              />
              <label className={`file__label ${this.state.dragIn && 'event-none'}`} htmlFor={`file_${container}`}>

              </label>
              <span className={`file__text ${this.state.dragIn && 'event-none'}`}>{ title }</span>
            </div>)
  }

  componentDidMount() {
    this.dragRef.current.addEventListener('dragenter', this.dragenter);
    this.dragRef.current.addEventListener('dragover', this.dragover);
    this.dragRef.current.addEventListener('dragleave', this.dragleave);
    this.dragRef.current.addEventListener('drop', this.drop);
  }

  componentWillUnmount() {
    this.dragRef.current.removeEventListener('dragenter', this.dragenter);
    this.dragRef.current.removeEventListener('dragover', this.dragover);
    this.dragRef.current.removeEventListener('dragleave', this.dragleave);
    this.dragRef.current.removeEventListener('drop', this.drop);
  }
}