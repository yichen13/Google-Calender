import React from "react"

var $ = require('jquery');

export default class Pancake extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: [],
            array: [],
            edit: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (event.target.value === 'Submit') {
            let array = getArray(parseInt(this.state.number));
            this.setState({
                array: array,
                edit: true
            })
        } else if (event.target.value === 'Send') {
            $.post('http://localhost:8080/pancake', {
                array: this.state.array
            }).then((data) => {
                let array = data.join();
                this.setState({
                    array: array
                })
            })
        }
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({
            number: event.target.value,
        });
    }

    render() {
        if (!this.state.edit) {
            return (
                <div>
                    <form>
                        <label>
                            How many #s:
                            <input onChange={this.handleChange}></input>
                            <input type='submit' value='Submit' onClick={this.handleSubmit}></input>
                        </label>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <form>
                        <label>
                            How many #s:
                            <input onChange={this.handleChange}></input>
                            <input type='submit' value='Submit' onClick={this.handleSubmit}></input>
                        </label>
                        <h4>{this.state.array}</h4>
                        <input type='submit' value='Send' onClick={this.handleSubmit}></input>
                    </form>
                </div>
            )
        }
    }
}

function getArray(n) {
    let array = [];
    for (let i = 1; i <= n; i++) {
        let rand = Math.ceil(Math.random() * 100);
        if (!array.includes(rand)) {
            array.push(rand)
        } else {
            i--;
        }
    }
    for (let x = array.length - 1; x > 0; x--) {
        let index = Math.floor(Math.random() * x);
        let obb = array[index];
        array[index] = array[x];
        array[x] = obb
    }
    console.log(array);
    return array.join()
}
