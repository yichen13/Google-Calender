import React from "react";
var $ = require('jquery');
class GenerateAnswer extends React.Component {
    getHeader() {
        let row = [];
        this.props.data.forEach((e) => {
            let t = [];
            e.forEach((i) => {
                t.push(<th>{i}</th>)
            });
            row.push(<tr>{t}</tr>)
        });
        return row
    }
    render() {
        if (this.props.data == undefined) {
            return []
        }
        console.log(this.props.data);
        return (
            <table>
                {this.getHeader()}
            </table>
        )
    }
}

class GenerateSquare extends React.Component {
    getSquare(i, t, k) {
        if (i === 0) {
            var row = [];
            var count = 0;
            while (count < t) {
                row.push(
                    <input type="text" size="3" onChange={this.props.onChange.bind(this, count, k)}/>
                );
                count++
            }
            return row
        } else {
            var row = [];
            var z = 0;
            var count = i * 10;
            while (z < t) {
                row.push(
                    <input type="text" size="3" onChange={this.props.onChange.bind(this, count, k)}/>
                );
                count++;
                z++;
            }
            return row
        }
    }
    squareA() {
        var square = [];
        let i = 0;
        while (i < this.props.ARow) {
            square.push(
                <div>
                    <label>
                        {this.getSquare(i, this.props.ACol, 'A')}
                    </label>
                </div>
            );
            i++
        }
        return square
    }
    squareB() {
        var square = [];
        let i = 0;
        while (i < this.props.BRow) {
            square.push(
                <div>
                    <label>
                        {this.getSquare(i, this.props.BCol, 'B')}
                    </label>
                </div>
            );
            i++
        }
        return square
    }
    render() {
        return (
            <div>
                <form onSubmit={this.props.onClick.bind(this)}>
                    <h1>A</h1>
                    {this.squareA()}
                    <h1>B</h1>
                    {this.squareB()}
                    <input type="submit" value="Calculate"/>
                </form>
            </div>
        )
    }
}


export default class Matrix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squareA: {},
            squareB: {},
            result: [],
            xRow: [],
            xCol: [],
            yRow: [],
            yCol: [],
            answer: false,
            edit: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    setupSquares() {
        var squareA = {};
        var squareB = {};
        var countA = 0;
        var countB = 0;
        for (let i=0; i < this.state.xRow; i++) {
            (i === 0) ? countA = 0 : countA = i * 10;
            for (let t = 0; t < this.state.xCol; t++) {
                squareA[countA] = [];
                countA++
            }
        }
        for (let i=0; i < this.state.yRow; i++) {
            (i === 0) ? countB = 0 : countB = i * 10;
            for (let t = 0; t < this.state.yCol; t++) {
                squareB[countB] = [];
                countB++
            }
        }
        this.setState({
            squareA: squareA
        });
        this.setState({
            squareB: squareB
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.edit) {
            this.setupSquares();
            this.setState({edit: true})
        } else {
            $.post('http://localhost:8080/matrixCal', {
                squareA: this.state.squareA,
                squareB: this.state.squareB
            }).then(data => {
                    this.setState({
                        result: data,
                        answer: true
                    })
                }
            )
        }
    }

    handleInput(k, j, i) {
        if (j === "A") {
                this.state.squareA[k] = i.target.value
        } else {
                this.state.squareB[k] = i.target.value
        }
    }

    render() {
        if (!this.state.edit) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <h3>Matrix Mutiplication Calculator</h3>
                    <label>
                        A :
                        <input type="text" value={this.state.xRow} name="xRow" size="4" onChange={this.handleChange}/>
                        <input type="text" value={this.state.xCol} name="xCol" size="4" onChange={this.handleChange}/>
                    </label>
                    <label>
                        B :
                        <input type="text" value={this.state.yRow} name="yRow" size="4" onChange={this.handleChange}/>
                        <input type="text" value={this.state.yCol} name="yCol" size="4" onChange={this.handleChange}/>
                    </label>
                    <input value="Generate" name="generate" type="submit"/>
                </form>
            )
        } else {
            return (
                <div>
                    <table>
                        <tr>
                            <th>
                                <GenerateSquare
                                    ARow={this.state.xRow}
                                    ACol={this.state.xCol}
                                    BRow={this.state.yRow}
                                    BCol={this.state.yCol}
                                    onChange={(i, j, k) => this.handleInput(i, j, k)}
                                    onClick={(i) => this.handleSubmit(i)}
                                />
                            </th>
                            <th>
                                <GenerateAnswer
                                    data={this.state.result}
                                />
                            </th>
                        </tr>
                    </table>
                </div>
            )
        }
    }
}
