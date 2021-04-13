import React from "react";
var $ = require('jquery');

class ResultRow extends React.Component {
    renderRow() {
        let row = [];
        this.props.data.forEach((e, index) => {
            let sRow = [];
            e.map((x) => {
                sRow.push(
                    <td>{x}</td>
                )
            });
            row.push(
                <tr>{sRow}</tr>
            )
        });
        return row
    }
    render() {
        return (
            this.renderRow()
        )
    }
}

export default class Matching extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student: [],
            hospital: [],
            studentInfo: {},
            hospitalInfo: {
                pick: {},
                opening: {}
            },
            result: [],
            edit: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleInput(data, i) {
        if (i === 'h') {
            Object.entries(data).forEach(([key, value]) => {
                this.state.hospitalInfo.pick[key] = value;
            });
        } else if (i === 'p') {
            Object.entries(data).forEach(([key, value]) => {
                this.state.hospitalInfo.opening[key] = value;
            })
        } else {
            Object.entries(data).forEach(([key, value]) => {
                this.state.studentInfo[key] = value;
            });
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if ((Object.keys(nextState.hospitalInfo).length === 0) && (Object.keys(nextState.studentInfo).length === 0)) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    handleClick(event) {
        event.preventDefault();
        this.setState({
            edit: true
        })
    }


    sendData() {
        $.post('http://localhost:8080/matching', {
            student: this.state.studentInfo,
            hospital: this.state.hospitalInfo
        }).then(data => {
            console.log(data);
            this.setState({
                result: data,
                edit: false
                }
            );
        })
    }

    generateHList() {
        let arr = [];
        let prop = {};
        let pick = {};
        for (let i = 0; i < parseInt(this.state.hospital); i++) {
            let list = fisherYates(parseInt(this.state.student));
            let open = randomInteger(parseInt(this.state.student), parseInt(this.state.hospital));
            arr.push(
                <tr>
                    <td>Hospital {i}</td>
                    <td>{list}</td>
                    <td className="text-center">{open}</td>
                </tr>
            );
            prop[i] = list;
            pick[i] = open;
        }
        this.handleInput(pick, 'p');
        this.handleInput(prop, 'h');
        return arr
    };

    generateSList() {
        let arr = [];
        let prop = {};
        for (let i = 0; i < parseInt(this.state.student); i++) {
            let list = randomList(parseInt(this.state.hospital));
            arr.push(
                <tr>
                    <td>Student {i}</td>
                    <td>{list}</td>
                </tr>
            );
            prop[i] = list
        }
        this.handleInput(prop, 's');
        return arr
    }

    render() {
        if (!this.state.edit) {
            return (
                <div>
                    <h3>National Residency Matching Program</h3>
                    <form>
                        <label>
                            How many students:
                            <input size="3" name="student" onChange={this.handleChange}></input>
                        </label>
                    </form>
                    <form>
                        <label>
                            How many hospital:
                            <input size="3" name="hospital" onChange={this.handleChange}></input>
                        </label>
                    </form>
                    <input type="submit" value="Submit" onClick={this.handleClick} />
                    <table>
                        <ResultRow
                            data = {this.state.result}
                        />
                    </table>
                </div>
            )
        } else {
            return (
                <div>
                    <h3>National Residency Matching Program</h3>
                    <form>
                        <label>
                            How many students:
                            <input size="3" onChange={this.handleChange}></input>
                        </label>
                    </form>
                    <form>
                        <label>
                            How many hospital:
                            <input size="3" onChange={this.handleChange}></input>
                        </label>
                    </form>
                    <table>
                        <tbody>
                        <tr>
                            <th>Student</th>
                            <th>Rank</th>
                        </tr>
                        {this.generateSList()}
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                        <tr>
                            <th>Hospital</th>
                            <th>Rank</th>
                            <th>Opening</th>
                        </tr>
                        {this.generateHList()}
                        </tbody>
                    </table>
                    <input type="submit" value="Send" id="sendData" onClick={this.sendData}/>
                </div>
            )
        }
    }
}

function randomList(i) {
    let arr = [];
    for (let x = 0; x < i; x++) {
        arr.push(x)
    }
    return arr.sort(function(a,b) {
        return 0.5 - Math.random()
    }).join();
}

function fisherYates(list) {
    let arr = [];
    for (let i = 0; i < list; i++) {
        arr.push(i)
    }
    for (let i = arr.length - 1; i > 0; i--) {
       let index = Math.floor(Math.random() * i);
       let obb = arr[i];
       arr[i] = arr[index];
       arr[index] = obb;
    }
    return arr.join()
}

function randomInteger(s, h) {
    let min = 3;
    let max = Math.floor(s / h);
    return Math.floor(Math.random() * (max - min)) + min
}
