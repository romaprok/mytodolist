import React from 'react';
import './App.css';
import AddNewItemForm from './AddNewItemForm'
import TodoListTasks from './TodoListTasks'
import TodoListFooter from './TodoListFooter'
import TodoListTitle from "./TodoListTitle";
import {connect} from "react-redux";

class TodoList extends React.Component {

    state = {
        filterValue: 'All'
    };
    nextItemId = 1

    // componentDidMount() {
    //     this.restoreState()
    // }
    //
    // saveState = () => {
    //     let stateAsString = JSON.stringify(this.state)
    //     localStorage.setItem('state' + this.props.id, stateAsString)
    // }
    // restoreState = () => {
    //     let state = {
    //         tasks: [],
    //         filterValue: 'All'
    //     }
    //     let stateAsString = localStorage.getItem('state' + this.props.id)
    //     if (stateAsString != null) {
    //         state = JSON.parse(stateAsString)
    //     }
    //     state.tasks.forEach(t => {
    //         if (t.id >= this.nextItemId) {
    //             this.nextItemId = t.id + 1
    //         }
    //     })
    //     this.setState(state)
    // }

    addTask = (newText) => {
        let newTask = {
            id: this.nextItemId,
            title: newText,
            isDone: false,
            priority: 'low'
        }
        this.nextItemId++
        this.props.addTask(newTask,this.props.id)
    }

    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        }, () => {
            this.saveState()
        })
    }
    changeTask = (taskId, obj) => {
        let newTasks = this.props.tasks.map(t => {
            if (t.id != taskId) {
                return t
            } else {
                return {...t, ...obj}
            }
        })
        this.setState({
            tasks: newTasks
        }, () => {
            this.saveState()
        })
    }

    changeStatus = (taskId, isDone) => {
        this.changeTask(taskId, {isDone: isDone})
    }
    changeTitle = (taskId, title) => {
        this.changeTask(taskId, {title: title})
    }

    render = () => {
        return (
            <div className="todoList">
                <div className='todoList-header'>
                    <TodoListTitle title={this.props.title}/>
                    <AddNewItemForm addItem={this.addTask}/>
                </div>
                <TodoListTasks changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle}
                               tasks={this.props.tasks.filter(t => {
                                   switch (this.state.filterValue) {
                                       case "All":
                                           return t;
                                       case "Completed":
                                           return t.isDone;
                                       case "Active":
                                           return !t.isDone
                                   }
                               })}/>
                <TodoListFooter changeFilter={this.changeFilter} filterValue={this.state.filterValue}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTask(newTask, todoListId) {
            let action = {
                type: 'ADD-TASK',
                newTask,
                todoListId
            }
            dispatch(action)
        }
    }
}
const ConnectedTodoList = connect(null, mapDispatchToProps)(TodoList)
export default ConnectedTodoList;

