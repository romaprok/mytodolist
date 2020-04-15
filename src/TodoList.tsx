import React from 'react';
import './App.css';
import TodoListTasks from "./TodoListTasks";
import TodoListFooter from "./TodoListFooter";
import TodoListTitle from "./TodoListTitle";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {
    addTask,
    changeTitle,
    deleteTask,
    deleteTodo,
    getTasks,
    updateTask
} from "./reducer";
import Preloader from "./Preloader";
import {TaskType, TodoListType} from "./types/entities";


type PropType = {
    setTasks:(todolistId:string)=>void,
    addTask:(newText:string, todolistId:string)=>void,
    updateTask:(todolistid:string, taskId:string, obj:any, task:TaskType)=>void,
    deleteTodolist:(todolistId:string)=>void,
    deleteTask:(taskId:string, todolistid:string)=>void,
    changeHeader:(todolistId:string, title:string)=>void,
    id:string,
    disabledDeleteTodolist:boolean,
    title:string,
    preloader:boolean,
    requestStatus:boolean,
    tasks:Array<TaskType>,
    todolists:Array<TodoListType>
}
type StateType = {
    filterValue:string
}
class TodoList extends React.Component<PropType, StateType> {

    componentDidMount() {
        this.restoreState();
    }

    restoreState = () => {
        this.props.setTasks(this.props.id)
    }

    state = {
        filterValue: "All"
    };
    addTask = (newText:string) => {
        this.props.addTask(newText, this.props.id)
    }
    changeFilter = (newFilterValue:string) => {
        this.setState({
            filterValue: newFilterValue
        });
    }

    changeTask = (taskId:string, obj:any) => {
        let changedTask = this.props.tasks.find((task:TaskType) => {
            return task.id === taskId
        });
        let task = {...changedTask, ...obj};
        this.props.updateTask(this.props.id, taskId, obj, task)
    }
    changeStatus = (taskId:string, status:number) => {
        this.changeTask(taskId, {status: status});
    }
    changeTitle = (task:string, title:string) => {
        this.changeTask(task, {title: title});
    }
    deleteTodolist = () => {
        this.props.deleteTodolist(this.props.id)
    }
    deleteTask = (taskId:string) => {
        this.props.deleteTask(taskId, this.props.id)
    }
    changeHeader = (title:string) => {
        this.props.changeHeader(this.props.id, title)
    }

    render = () => {
        let {tasks = []} = this.props;
        let disabled = this.props.todolists.map(t=>t.disabled)
        let preloader = this.props.todolists.map(t=>t.preloader)
        return (
            <div className="todoList">
                <div className="todoList-header">
                    <TodoListTitle changeHeader={this.changeHeader}
                                   disabled={this.props.disabledDeleteTodolist}
                                   id={this.props.id}
                                   title={this.props.title}
                                   onDelete={this.deleteTodolist}/>
                    <AddNewItemForm
                        disabledTodo={disabled}
                            /*{this.props.todolists.disabled}*/

                        requestStatus={this.props.requestStatus}
                        addItem={this.addTask}/>
                </div>
                {/*{this.props.todolists.preloader*/}
                {preloader
                    ? <Preloader preloader={'preloader'}/>
                    : <TodoListTasks changeStatus={this.changeStatus}
                                     changeTitle={this.changeTitle}
                                     deleteTask={this.deleteTask}
                                     preloader={this.props.preloader}
                        /*tasks={this.props.tasks.filter(t => {*/
                                     tasks={tasks
                                         .filter(t => {
                                             if (this.state.filterValue === "All") {
                                                 return true;
                                             }
                                             if (this.state.filterValue === "Active") {
                                                 return t.status === 0
                                             }
                                             if (this.state.filterValue === "Completed") {
                                                 return t.status === 2
                                             }
                                         })}
                    />}

                <TodoListFooter changeFilter={this.changeFilter} filterValue={this.state.filterValue}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        addTask(task:string, todolistId:string) {
            const thunk = addTask(task, todolistId)
            dispatch(thunk);
        },
        setTasks: (todolistId:string) => {
            const thunk = getTasks(todolistId)
            dispatch(thunk)
        },
        updateTask(todolistId:string, taskId:string, obj:any, task:TaskType) {
            const thunk = updateTask(todolistId, taskId, obj, task);
            dispatch(thunk);
        },
        deleteTodolist: (todolistId:string) => {
            const thunk = deleteTodo(todolistId);
            dispatch(thunk)
        },
        deleteTask: (taskId:string, todolistId:string) => {
            const thunk = deleteTask(taskId, todolistId);
            dispatch(thunk)
        },
        changeHeader: (todolistId:string, title:string) => {
            const thunk = changeTitle(todolistId, title)
            dispatch(thunk)
        }
    }
}

const ConnectedTodolist = connect(null, mapDispatchToProps)(TodoList);

export default ConnectedTodolist;
