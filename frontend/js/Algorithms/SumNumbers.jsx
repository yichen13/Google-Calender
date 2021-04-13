import React from 'react'
var $ = require('jquery');


export default class SortedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            number: [],
            array: [],
            randNum: [],
            result: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({
            number: parseInt(event.target.value),
            }
        )
    }
    handleSubmit(event) {
        event.preventDefault();
        if (event.target.value === 'Send') {
            this.setState({
                array: getArray(this.state.number),
                randNum: getRandomNum(this.state.number),
                edit: true
            })
        } else if (event.target.value === 'Submit') {
            $.post('http://localhost:8080/sumArr', {
                array: this.state.array,
                randNum: this.state.randNum
            }).then((data) => {
                let i = [];
                data.forEach((e) => {
                    i += '[' + e[0] + ',' + e[1] + ']'
                });
                this.setState({
                    result: i
                })
            })
        } else if (event.target.value === 'Restart') {
            this.setState({
                edit: false,
                array: [],
                randNum: [],
                result: []
            })
        }
    }
    render() {
        if (!this.state.edit) {
            return (
                <div>
                    <h5>Check if array has two elements x and y s.t x + y = u</h5>
                    <form>
                        <label>
                            How many integers? :
                            <input onChange={this.handleChange}/>
                            <input type='submit' value='Send' onClick={this.handleSubmit} />
                            <input type='submit' value='Restart' onClick={this.handleSubmit} />
                        </label>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <form>
                        <label>
                            How many integers? :
                            <input onChange={this.handleChange}/>
                            <br />
                            <h6>Array: {this.state.array}</h6>
                            <h5>Random Integer: {this.state.randNum}</h5>
                            <input type='submit' value='Submit' onClick={this.handleSubmit} />
                            <input type='submit' value='Restart' onClick={this.handleSubmit} />
                            <h6>{this.state.result}</h6>
                        </label>
                    </form>
                </div>
            )
        }
    }
}

function getArray(int) {
    let arr = [];
    for (let i = 0; i < int; i++) {
        let t = Math.ceil(Math.random() * int);
        arr.push(t);
    }
    return arr.join()
}

function getRandomNum(int)  {
    let min = 25;
    return Math.floor(Math.random() * (int - min)) + min
}
