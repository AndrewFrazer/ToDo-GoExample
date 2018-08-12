import React, { Component } from 'react';

const url = 'http://localhost:8080/api/1.0/todos/';

class Put extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            completed: false,
            id: null,
            message: null
        };

        this.put = this.put.bind(this)
    }

    put() {
        let currentComponent = this;
        let jsonData = {
            title: this.state.title,
            completed: this.state.completed
        }
        let urlid = url + this.state.id;
        fetch(urlid, {
            method: "PUT",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(jsonData),
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (data.status !== 200) {
                console.log("status:" + data.status);
                console.log("message:" + data.message);
            } else {
                console.log("Request successfull!");
                currentComponent.setState({
                    message: data.message
                });
            }
        })
    }

    handleTitleChange = (evt) => {
        this.setState({title: evt.target.value})
    }

    handleCompletedChange = (evt) => {
        this.setState({completed: !this.state.completed})
    }

    handleIdChange = (evt) => {
        this.setState({id: evt.target.value})
    }

    render() {
      return (
        <div>
            <div>
                <button type="button" disabled={!this.state.id} onClick={this.put}>Update</button>
                <input name="id" value={this.state.id} onChange={this.handleIdChange}/>
            </div>
            <div>
                <input name="title" value={this.state.title} onChange={this.handleTitleChange}/>
            </div>
            <div>
                <label>
                    Completed?
                    <input type="checkbox" value={this.state.completed}
                        checked={this.state.completed === true}
                        onChange={this.handleCompletedChange} />
                </label>
            </div>
            {this.state.message != null &&
                    <div>
                        {this.state.message}
                    </div>
            }
        </div>
      );
    }
}


export default Put;