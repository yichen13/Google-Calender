import React from "react";
var $ = require('jquery');

export default class SortedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num1: [],
            num2: [],
            list1: [],
            list2: [],
            result: [],
            edit: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        event.preventDefault();
        if (event.target.name === 'list1') {
            this.setState({
                num1: parseInt(event.target.value)
            })
        } else if (event.target.name === 'list2') {
            this.setState({
                num2: parseInt(event.target.value)
            })
        }

    }

    handleSubmit(event) {
        event.preventDefault();
        if (event.target.value === 'Send') {

            let list1 = generateList(this.state.num1);
            let list2 = generateList(this.state.num2);
            this.setState({
                list1: list1,
                list2: list2,
                edit: true
            })
        } else if (event.target.value === 'Submit') {
            $.post('http://localhost:8080/sortedList', {
                list1: this.state.list1,
                list2: this.state.list2
            }).then((data) => {
                this.setState({
                    result: data.join()
                })
            })
        } else if (event.target.value === 'Restart') {
            this.setState({
                edit: false,
                result: []
            })
        }
    }

        render() {
        if (!this.state.edit) {
        return (
            <div>
                <h5>Two Sorted Lists A and B of items. Find all distinct items</h5>
                <form>
                    <label>
                        List #1 :
                    <input name='list1' onChange={this.handleChange}></input>
                    </label>
                    <br />
                    <label>
                        List #2 :
                        <input name='list2' onChange={this.handleChange}></input>
                    </label>
                    <input type='submit' value='Send' onClick={this.handleSubmit}/>
                </form>
            </div>
        )
    } else {
            return (
                <div>
                    <form>
                        <label>
                            List #1 :
                            <input name='list1' onChange={this.handleChange}></input>
                            <h3>{this.state.list1}</h3>
                        </label>
                        <br />
                        <label>
                            List #2 :
                            <input name='list2' onChange={this.handleChange}></input>
                            <h3>{this.state.list2}</h3>
                        </label>
                        <br />
                        <input type='submit' value='Submit' onClick={this.handleSubmit}/>
                        <input type='submit' value='Restart' onClick={this.handleSubmit} />
                        <h1>{this.state.result}</h1>
                    </form>
                </div>
            )
        }
    }
}

function generateList(int) {
    let array = [];
    for (let i = 0; i < int; i++) {
        let rand = Math.ceil(Math.random() * 20);
        if (!array.includes(rand)) {
            array.push(rand)
        } else {
            i--;
        }
    }
    return array.sort(function(a,b){return a - b}).join()
}
