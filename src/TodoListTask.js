import React, {Component} from "react";

class TodoListTask extends Component {

    state = {
        editMode: false
    }

    activateEditMode = () => {
        this.setState({
            editMode: true
        })
    }
    deactivateEditMode = () => {
        this.setState({
            editMode: false
        })
    }
    onIsDoneChange = (e) => {
        let status = e.currentTarget.checked ? 2 : 0
        this.props.changeStatus(this.props.task, status)
    }
    onTaskChange = (e) => {
        this.props.changeTitle(this.props.task, e.currentTarget.value)
    }
    onDeleteTask = () => {
        debugger
        this.props.deleteTask(this.props.task.id);
    }

    render() {
        let priority = this.props.task.priority === 0 ? 'Low'
            : this.props.task.priority === 1 ? 'Middle'
                : this.props.task.priority === 2 ? 'Hi'
                    : this.props.task.priority === 3 ? 'Urgently'
                        : 'Later'
        let opacityTask = this.props.task.status === 2 ? 'todoList-task done' : 'todoList-task'
        return (
            <div className={opacityTask}>
                <input type="checkbox"
                       onChange={this.onIsDoneChange}
                       checked={this.props.task.status === 2 ? true : false}/>
                {this.props.task.id} -
                {this.state.editMode
                    ? <input value={this.props.task.title} autoFocus={true} onBlur={this.deactivateEditMode}
                             onChange={this.onTaskChange}/>
                    : <span onClick={this.activateEditMode}> {this.props.task.title}</span>}
                <span> , priority : {priority}
                    <button onClick={this.onDeleteTask}>x</button></span>
            </div>
        )
    }
}

export default TodoListTask