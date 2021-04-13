import Graph from 'react-graph-vis'
import React from "react"
var $ = require('jquery');

export default class BFS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            nodes: [],
            edges: [],
            numbers: [],
            arr: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        if (event.target.value === 'Submit') {
            let t = run();
            console.log(t);
            this.setState({
                edit: true
            })
        } else {
            event.preventDefault();
            let edges = this.state.numbers.join();
            let arr = this.state.arr.join();
            $.post('http://localhost:8080/BFS', {
                nodes: this.state.nodes,
                edges: edges,
                arr: arr
            }).then((data) => {
                console.log(data)
            })
        }
    }
    handleChange(event) {
        event.preventDefault();
        if (event.target.value === '1') {
            return
        }
        if (event.target.name === 'nodes') {
            let nodes = getNode(parseInt(event.target.value));
            let edges, edge, arr;
            [edges, edge, arr] = getEdge(parseInt(event.target.value));
            this.setState({
                nodes: nodes,
                edges: edges,
                numbers: edge,
                arr: arr
            })
        }
    }
    render() {
        const getNum = this.state.numbers.map((e) =>  <th key={e}>{e.join()}</th>);
        const graph = {
            nodes: this.state.nodes,
            edges: this.state.edges
        };

        const options = {
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000"
            }
        };

        const events = {
            select: function(event) {
                var { nodes, edges } = event;
                // console.log("Selected nodes:");
                // console.log(nodes);
                // console.log("Selected edges:");
                // console.log(edges);
            }
        };
        if (!this.state.edit) {
            return (
                <form>
                    <label>
                        How many nodes?
                        <input name='nodes' onChange={this.handleChange} />
                        <input type='submit' value='Submit' onClick={this.handleSubmit} />
                    </label>
                    <br />
                </form>
            )
        }
        else {
            return (
                <div>
                    <form>
                        <label>
                            How many nodes?
                            <input name='nodes' onChange={this.handleChange}></input>
                            <input type='submit' value='Send' onClick={this.handleSubmit} />
                        </label>
                        <br/>
                    </form>
                    <table>
                        <tr>
                    {getNum}
                        </tr>
                    </table>
                    <Graph graph={graph} options={options} events={events} style={{height: "640px"}}/>
                </div>
            )
        }
    }
}

function getNode(int) {
    let arr = [];
    for (let i = 1; i <= int; i++) {
        arr.push({id: i, label: 'Node ' + i, color: "#e04141"})
    }
    return arr
}

function getEdge(int) {
    let edges = [];
    let edge = [];
    let arr = [];
    for (let i = 1; i <= int; i++) {
        let from = i;
        let to = Math.ceil(Math.random() * int);
        if ((from !== to) && checkArray(edge, [from, to])) {
            edges.push({from: from, to: to}, {from: to, to: from});
            edge.push([from, to], [to, from]);
            arr.push([from, to])
        } else {
            i--
        }
    }
    return [edges, edge, arr]
}

function checkArray(edge, o) {
    let t = true;
    edge.forEach((e) => {
        if ((e[0] === o[0]) && (e[1] === o[1])) {
            t = false
        }
    });
    return t
}

function testFunction() {
    return new Promise(function(resolve, reject) {
        resolve([ "test1", "test2"] );
    });
}

async function run() {

    const [firstRes, secondRes] = await testFunction();

    console.log(firstRes, secondRes);

}
