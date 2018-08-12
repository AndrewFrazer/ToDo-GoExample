import React, { Component } from 'react';

const url = 'http://localhost:8080/api/1.0/todos/';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            completed: false,
            id: null,
            message: null
        };

        this.post = this.post.bind(this)
    }

    post() {
        let currentComponent = this;
        let jsonData = {
            title: this.state.title,
            completed: this.state.completed
        }
        fetch(url, {
            method: "POST",
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
            if (data.status !== 201) {
                console.log("status:" + data.status);
                console.log("message:" + data.message);
            } else {
                console.log("Request successfull!");
                currentComponent.setState({
                    id: data.resourceId,
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

    render() {
      return (
        <div>
            <div>
                <button type="button" disabled={!this.state.title} onClick={this.post}>Create</button>
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
                        {this.state.message + " with id: " + this.state.id}
                    </div>
            }
        </div>
      );
    }
}


export default Post;