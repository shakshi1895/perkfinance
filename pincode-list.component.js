import React, { Component } from 'react';
import axios from 'axios';
const Todo = props => (
    <tr>
        <td>{props.todo.pincode}</td>
        <td>{props.todo.Taluk}</td>
        <td>{props.todo.Districtname}</td>
        <td>{props.todo.statename}</td>
    </tr>
)
export default class TodosList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [], original: [], statename: "", 
            district: "", taluk: "", pincode: "", data_count: 0, 
            start_from: 0, end_to: 100
        };
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleDisChange = this.handleDisChange.bind(this);
        this.handleTalukChange = this.handleTalukChange.bind(this);
        this.handlePinChange = this.handlePinChange.bind(this);
        this.handleSRangeChange = this.handleSRangeChange.bind(this);
        this.handleERangeChange = this.handleERangeChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    handleStateChange(e){
        this.setState({statename: e.target.value});
        this.handleChange();
    }

    handleDisChange(e){
        this.setState({district: e.target.value});
        this.handleChange()        
    }

    handleTalukChange(e){
        this.setState({taluk: e.target.value});
        this.handleChange()
    }    

    handlePinChange(e){
        this.setState({pincode: e.target.value});
        this.handleChange()
    }

    handleSRangeChange(e){
        this.setState({start_from: e.target.value});
    }

    handleERangeChange(e){
        this.setState({end_to: e.target.value});
    }
    
    handleChange() {
        let currentList = [];
        let newList = [];
        currentList = this.state.original;
        newList = currentList.filter(item => {
            const state = item.statename.toLowerCase();
            const state_search = this.state.statename.toLowerCase();
            const district = item.Districtname.toLowerCase();
            const district_search = this.state.district.toLowerCase();
            const taluk = item.Taluk.toLowerCase();
            const taluk_search = this.state.taluk.toLowerCase();
            const pin = item.pincode.toLowerCase();
            const pin_search = this.state.pincode.toLowerCase();
            return state.includes(state_search) & district.includes(district_search) & taluk.includes(taluk_search) & pin.includes(pin_search)
        });
        this.setState({todos: newList});
    }

    // updateData(){
    //     console.log("entered here");
    //     this.componentDidMount()
    // }

    componentDidMount() {
        axios.get('http://localhost:4000/?start='+this.state.start_from+"&end="+this.state.end_to)
        .then(response => {
            this.setState({data_count: response.data['total']})
            this.setState({ todos: response.data['data'] });
            this.setState({ original: response.data['data'] });
        })
        .catch(function (error){
            console.log(error);
        })
    }

    todoList() {
        return this.state.todos.map(function(currentTodo, i){
            return <Todo todo={currentTodo} key={i}></Todo>;
        })
    }
    render() {
        return (
            <div>
                <b>Data Range:</b> <br/>
                Start From: <input type="number" className="input" 
                onChange={this.handleERangeChange}/>
                End: <input type="number" className="input" onChange={this.handleERangeChange}/>
                <button onClick = {this.componentDidMount}>Get Data</button><br/>
                <b>Filters: </b><br/>
                State: <input type="text" className="input" 
                onChange={this.handleStateChange} placeholder="Search..." />
                District: <input type="text" className="input" 
                onChange={this.handleDisChange} placeholder="Search..." />
                Taluk: <input type="text" className="input" 
                onChange={this.handleTalukChange} placeholder="Search..." />
                Pincode: <input type="text" className="input" 
                onChange={this.handlePinChange} placeholder="Search..." />
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Pincode</th>
                            <th>Taluk</th>
                            <th>District</th>
                            <th>State</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}