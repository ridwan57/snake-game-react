import React, { Component } from "react";
import Snake from "./Snake";
import Food from "./Food";

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: getRandomCoordinates(),
  speed: 100,
  highScore: localStorage.getItem("highScore"),
  direction: "RIGHT",
  snakeDots: [
    [0, 0],
    [2, 0],
    [4, 0],
    [6, 0],
    [8, 0],
  ],
};

class App extends Component {
  state = initialState;

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({ direction: "UP" });
        break;
      case 40:
        this.setState({ direction: "DOWN" });
        break;
      case 37:
        this.setState({ direction: "LEFT" });
        break;
      case 39:
        this.setState({ direction: "RIGHT" });
        break;
      default:
        this.setState({});
    }
  };
  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }

    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots,
    });
  };
  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    });
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10,
      });
    }
  }

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    console.log("Component Did Mount");
    document.onkeydown = this.onKeyDown;
    // this.setState({
    //   ...this.state,
    //   highScore: localStorage.getItem("highScore"),
    // });
  }
  componentWillUnmount() {
    console.log("Componeent will unmount");
  }
  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }
  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }
  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({
        food: getRandomCoordinates(),
      });
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }
  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({
      snakeDots: newSnake,
    });
  }

  onGameOver() {
    alert(
      `Game Over. Your Score is ${
        this.state.snakeDots.length - initialState.snakeDots.length
      }`
    );
    let high = 0;
    if (
      this.state.snakeDots.length - initialState.snakeDots.length >
      this.state.highScore
    ) {
      high = this.state.snakeDots.length - initialState.snakeDots.length;
    } else {
      high = this.state.highScore;
    }
    localStorage.setItem("highScore", high);
    this.setState({
      ...initialState,
      highScore: high,
    });
  }

  render() {
    return (
      <div>
        <h1 className="app__header">
          Your Score:{" "}
          {this.state.snakeDots.length - initialState.snakeDots.length}
        </h1>
        <p className="app__header__direction">
          Your Current Direction : {this.state.direction}
        </p>
        <p className="app__header__movement"> Press Arrow Key for movement</p>
        <p className="app__header__highScore">
          High Score:{this.state.highScore}
        </p>
        <div className="game-area">
          <Snake snakeDots={this.state.snakeDots} />
          <Food dot={this.state.food} />
        </div>
      </div>
    );
  }
}

export default App;
