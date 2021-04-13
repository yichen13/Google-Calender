import React from 'react'
var $ = require('jquery');


export default class Heap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            list: [],
            element: [],
            array: {},
            result: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        event.preventDefault();
        if (event.target.name === 'list') {
            this.setState({
                    list: parseInt(event.target.value),
                }
            )
        } else if (event.target.name === 'element') {
            this.setState({
                    element: parseInt(event.target.value),
                }
            )
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        if (event.target.value === 'Send') {
            let array = getArray(this.state.element, this.state.list);
            Object.keys(array).forEach((e) => {
                this.state.array[e] = array[e]
            });
            this.setState({
                edit: true
            })
        } else if (event.target.value === 'Submit') {
            let array = {};
            Object.keys(this.state.array).map((e) => {
                array[e] = String(this.state.array[e])
            });
            $.post('http://localhost:8080/heap', {
                list: array
            }).then((data) => {
                this.setState({
                    result: data.join(),
                })
            })
        } else if (event.target.value === 'Restart') {
            this.setState({
                edit: false,
                result: [],
                array: [],
            })
        }
    }
    render() {
        const data = Object.keys(this.state.array).map((e) => <li key={e}>{this.state.array[e].join()}</li>);
        if (!this.state.edit) {
            return (
                <div>
                    <h5>Merge k list with n elements into a sorted list</h5>
                    <form>
                        <label>
                            How many list? :
                            <input name='list' onChange={this.handleChange}/>
                        </label>
                        <br />
                        <label>
                            How many elements? :
                            <input name='element' onChange={this.handleChange}/>
                            <br />
                            <input type='submit' value='Send' onClick={this.handleSubmit} />
                            <input type='submit' value='Restart' onClick={this.handleSubmit} />
                        </label>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <h5>Merge k list with n elements into a sorted list</h5>
                    <form>
                        <label>
                            How many list? :
                            <input name='list' onChange={this.handleChange}/>
                        </label>
                        <br />
                        <label>
                            How many elements? :
                            <input name='element' onChange={this.handleChange}/>
                            <input type='submit' value='Submit' onClick={this.handleSubmit} />
                            <input type='submit' value='Restart' onClick={this.handleSubmit} />
                        </label>
                        <h1>{data}</h1>
                        <h5>{this.state.result}</h5>
                    </form>
                </div>
            )
        }
    }
}

function getArray(e, l) {
    let array = {};
    for (let i = 0; i < l; i++) {
        let tempArr = [];
        if (i !== l-1) {
            let min = 4;
            let max = Math.ceil(e / (l/(1.5)));
            let maxE = Math.floor(Math.random() * (max - min)) + min;
            for (let x = 0; x < maxE; x++) {
                tempArr.push(getRandomNum())
            }
            array[i] = tempArr
        } else {
            let count = 0;
            Object.keys(array).map((i) => {
                count += array[i].length
            });
            for (let x = 0; x < (e - count); x++) {
               tempArr.push(getRandomNum())
            }
            array[i] = tempArr
        }
    }
    return array
}

function getRandomNum()  {
    return Math.floor(Math.random() * 100)
}
