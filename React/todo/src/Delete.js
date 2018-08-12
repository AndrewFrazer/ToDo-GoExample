import React, { Component } from 'react';

const url = 'http://localhost:8080/api/1.0/todos/';

class Delete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            message: null
        };

        this.delete = this.delete.bind(this)
    }

    delete() {
        let currentComponent = this;
        let urlid = url + this.state.id;
        fetch(urlid, {
            method: "Delete",
            mode: "cors",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
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

    handleIdChange = (evt) => {
        this.setState({id: evt.target.value})
    }

    render() {
      return (
        <div>
            <div>
                <button type="button" disabled={!this.state.id} onClick={this.delete}>Delete</button>
                <input name="id" value={this.state.id} onChange={this.handleIdChange}/>
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


export default Delete;