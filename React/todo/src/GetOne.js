import React, { Component } from 'react';

const url = 'http://localhost:8080/api/1.0/todos/';

class GetOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            id: null
        };

        this.getById = this.getById.bind(this)
    }

    getById() {
        let currentComponent = this;
        let urlid = url + this.state.id;
        fetch(urlid, {
            method: "GET",
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
                currentComponent.setState({title: data.data.title});
            }
        })
    }

    handleChange = (evt) => {
        this.setState({id: evt.target.value})
    }

    render() {
      return (
          <div>
            <button type="button" disabled={!this.state.id} onClick={this.getById}>Get by Id</button>
            <input name="id" value={this.state.id} onChange={this.handleChange}/>
            <div>
                {this.state.title}
            </div>
          </div>
      );
    }
}


export default GetOne;