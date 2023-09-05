const express = require ('express');
const app = express();
const fs = require ('fs');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs")

app.use(methodOverride('_method'));


app.get('/', (req,res) => {
    res.render("form");
})

//post details/
app.post('/index', (req, res) => {
    const id =req.body.id;
    const name = req.body.name;
    const lname = req.body.lname;
    const sub = req.body.sub;
    const mark = req.body.mark;

    let data = [];
    try {
        data = JSON.parse(fs.readFileSync('data.json'));
        console.log(data);
    } catch (error) {
        console.error('Error reading data from data.json:', error);
    }

    data.push({ id,name, lname , sub , mark});

    fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');

    res.redirect('/index');
});
//post end//

//get jsondata//
app.get('/index', (req, res) => {
    let data = [];
    try {
        const jsonData = fs.readFileSync('data.json', 'utf-8');
        data = JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading data from data.json:', error);
    }

    res.render('index', { data });
});
//end//

//put method//

app.get('/edit/:id', (req, res) => {
    const editId = req.params.id;
    let itemToUpdate;

    try {
        const jsonData = fs.readFileSync('data.json', 'utf-8');
        const data = JSON.parse(jsonData);
        itemToUpdate = data.find(item => item.id == editId);
        if (!itemToUpdate) {
            return res.redirect('/index');
        }
    
        res.render('edit', { item: itemToUpdate });
        
    } catch (error) {
        console.error('Error reading data from data.json:', error);
    }
    console.log(itemToUpdate);
});


app.put('/edit/:id', (req, res) => {
    const editId = req.params.id;
    const {id, name, lname, sub, mark } = req.body;

    let data = [];
    try {
        data = JSON.parse(fs.readFileSync('data.json'));
        const index = data.findIndex(item => item.id == editId);
        if (index !== -1) {
            data[index] = { id: editId, name, lname, sub, mark };
            fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');
        }
    } catch (error) {
        console.error('Error updating data:', error);
    }

    res.redirect('/index');
});


//end//

//delete//
app.delete('/edit/:id', (req, res) => {
    const deleteId = req.params.id;
    let data = [];

    try {
        const jsonData = fs.readFileSync('data.json', 'utf-8');
        data = JSON.parse(jsonData);
        data = data.filter(item => item.id != deleteId);
        fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8');
    } catch (error) {
        console.error('Error deleting data:', error);
    }

    res.redirect('/index');
});

app.listen(PORT , () => {
    console.log("running");
})

//end//