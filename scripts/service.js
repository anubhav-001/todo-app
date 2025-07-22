// logics of CRUD operations

const todoOperations = {
    // tasks:[],
    tasks: (() => {
    try {
        const data = localStorage.getItem('localData');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
    })(),
    getTotal(){
        return this.tasks.length;
    },
    addTask(task){
        task.isMarked = false;
        this.tasks.push(task);
        localStorage.setItem('localData' , JSON.stringify(this.tasks));
    },
    toggleTask(id){
        const taskObject = this.tasks.find(task => task.id === id);
        taskObject.isMarked = !taskObject.isMarked;
    },
    markCount(){
        return this.tasks.filter(task => task.isMarked).length;
    },
    unmarkCount(){
        return this.tasks.length - this.markCount();
    },
    removeTask(){
        this.tasks = this.tasks.filter(task => !task.isMarked);
    },
    filterByName(name){
        return this.tasks.filter(task => task.name == name);
    },
    updateTask(){
        
    },
    sortTask(){

    }
}

export default todoOperations;
