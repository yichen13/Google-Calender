import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Matrix from "./Matrix"
import Matching from "./Algorithms/Matching"
import Pancake from "./Algorithms/Pancake"
import SortedList from "./Algorithms/SortedList"
import SumNumbers from "./Algorithms/SumNumbers"
import Heap from "./Algorithms/Heap"
import BFS from "./Algorithms/BFS"
import Mod from "./Math/Math"

var $ = require('jquery');

const BasicExample = () => (
    <Router>
        <div>
            <table>
                <tbody>
                <tr>
                <th>
                    <Link to="/">Calendar</Link>
                </th>
                <th>
                    <Link to="/matrix">Matrix</Link>
                </th>
                <th>
                    <Link to="/topics">Algorithms</Link>
                </th>
                    <th>
                        <Link to="/math">Math</Link>
                    </th>
                </tr>
                </tbody>
            </table>
            <hr />
            <Route exact path="/" component={Login} />
            <Route path="/matrix" component={Matrix}/>
            <Route path="/topics" component={Topics} />
            <Route path="/math" component={Math} />
        </div>
    </Router>
);

const Math = ({match}) => (
    <div>
        <table>
            <tbody>
            <tr>
                <th>
                    <Link to={`${match.url}/math`}>Introduction to number theory</Link>
                </th>
            </tr>
            </tbody>
        </table>
        <Route path={`${match.url}/:topicIds`} component={Maths}/>
        <Route exact path={match.url} render={() => <h3>Please select a topic.</h3>}/>
    </div>
);

const Maths = ({match}) => {
    if (match.params.topicIds === 'math') {
        return (
            <Mod />
        )
    } else {
        return (
            <div>
                <h3>{match.params.topicIds}</h3>
            </div>
        )
    }
};

const Topics = ({match}) => (
    <div>
        <table>
            <tbody>
            <tr>
                <th>
                    <Link to={`${match.url}/matching`}>National Residency Matching Program</Link>
                </th>
                <th>
                    <Link to={`${match.url}/pancake`}>Pancake Problem</Link>
                </th>
                <th>
                    <Link to={`${match.url}/sortedList`}>Common items</Link>
                </th>
                <th>
                    <Link to={`${match.url}/sum`}>Sum in array</Link>
                </th>
                <th>
                    <Link to={`${match.url}/heap`}>Heap Merge</Link>
                </th>
                <th>
                    <Link to={`${match.url}/bfs`}>BFS</Link>
                </th>
            </tr>
            </tbody>
        </table>

        <Route path={`${match.url}/:topicId`} component={Topic}/>
        <Route exact path={match.url} render={() => <h3>Please select a topic.</h3>}/>
    </div>
);

const Topic = ({match}) => {
        if (match.params.topicId === 'matching') {
            return (
                <Matching />
            )
        } else if (match.params.topicId === 'pancake') {
            return (
                <Pancake />
            )
        } else if (match.params.topicId === 'sortedList') {
            return (
                <SortedList />
            )
        } else if (match.params.topicId === 'sum') {
            return (
                <SumNumbers />
            )
        } else if (match.params.topicId === 'heap') {
            return (
                <Heap />
            )
        } else if (match.params.topicId === 'bfs') {
            return (
                <BFS />
            )
        } else {
            return (
            <div>
                <h3>{match.params.topicId}</h3>
            </div>
            )
        }
};


class Login extends React.Component{
    login() {
        $.get(window.location.href + 'authorize', (data) => {
            window.location.replace(data);
        })
    }
    revoke() {
        $.get(window.location.href + 'revoke', (data) => {
            console.log(data)
        })
    }
    clear() {
        $.get(window.location.href+ 'clear', (data) => {
            console.log(data)
        })
    }
    render() {
        return (
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="font-weight-bold text-info display-1">Google Calendar</h1>
                    <hr className="my-4"></hr>
                    <p className="lead">Welcome to my web-application! Please click the button below me to sign in :D</p>
                    <button type="button" className="btn btn-outline-primary btn-lg btn-block" onClick={this.login}>
                        Google Login
                    </button>
                    <button type="button" className="btn btn-outline-primary btn-lg btn-block" onClick={this.revoke}>
                        Revoke Login
                    </button>
                    <button type="button" className="btn btn-outline-primary btn-lg btn-block" onClick={this.clear}>
                        Clear Credential
                    </button>
                </div>
            </div>
        )
    }
}

export default BasicExample;

