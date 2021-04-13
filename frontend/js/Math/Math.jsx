import React from "react"

var $ = require('jquery');

export default class Math extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 0,
            b: 0,
            c: 0,
            count: 0,
            list: [],
            edit: false,
            save: [],
            saved: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (event.target.value === 'Submit') {
            this.setState({
                list: calculateMod(this.state.a, this.state.b, this.state.c),
                edit: true
            })
        } else if (event.target.value === 'Save') {
            this.state.save.push(this.state.list);
            this.setState({
                list: [],
            });
            this.forceUpdate();
        }
    }

    handleChange(event) {
        event.preventDefault();
        if (event.target.name === 'a') {
            this.setState({
                a: event.target.value,
            });
        } else if (event.target.name === 'b') {
            this.setState({
                b: event.target.value,
            });
        } else if (event.target.name === 'c') {
            this.setState({
                c: event.target.value,
            });
        }
    }

    render() {
        if (!this.state.edit) {
            return (
                <div>
                    <h2>Modulo</h2>
                    <form>
                        <label>
                            <input name='a' onChange={this.handleChange}></input> congruent <input name='b' onChange={this.handleChange}></input> modulo <input name='c' onChange={this.handleChange}></input>
                            <input type='submit' value='Submit' onClick={this.handleSubmit}></input>
                        </label>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Modulo</h2>
                    <form>
                        <label>
                            <input name='a' onChange={this.handleChange}></input> congruent <input name='b' onChange={this.handleChange}></input> modulo <input name='c' onChange={this.handleChange}></input>
                            <input type='submit' value='Submit' onClick={this.handleSubmit}></input>
                            <input type='submit' value='Save' onClick={this.handleSubmit}></input>
                        </label>
                    </form>
                    x = {this.state.list.join()}
                    {this.state.save}
                </div>
            )
        }
    }
}

function calculateMod(a,b,c) {
    let array = [];
    if ((a === 'x') && (b === 'x')) {
        for (let i = 0; i < 100; i++) {
            for (let y = 0; y < parseInt(c); y++) {
                let t = (i - y) / c;
                if (parseInt(t) === t) {
                    array.push('[' + i);
                    array.push(y + ']');
                }
            }
        }
    } else if (a === 'x') {
        for (let i = 0; i < 100; i++) {
            let t = (i - b) / c;
            if (parseInt(t) === t) {
                array.push(i)
            }
        }
    }
    return array
}