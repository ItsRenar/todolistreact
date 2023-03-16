import React, { useState, useEffect } from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTodo from './AddTodo';

//https://bookstore-3dc80-default-rtdb.europe-west1.firebasedatabase.app/books/.json

function App() {
  const [book, setBook] = useState({ title: '', author: '', year: '', isbn: '', price: '', id1: new Date()});
  const [rows, setRows] = useState([]);
  const columns = [
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'author', headerName: 'Author', width: 250 },
    { field: 'year', headerName: 'Year', width: 250 },
    { field: 'isbn', headerName: 'lsbn', width: 250 },
    { field: 'price', headerName: 'Price', width: 250 },
    {field: 'delete', headerName: ' ', width: 100, renderCell: (params) => (
        <IconButton aria-label="delete" onClick={() => deleteBook(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const fetchBooks = () => {
    fetch('https://bookstore-3dc80-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
      .then(response => response.json())
      .then(data => {
        const bookArray = [];
        for (let key in data) {
          bookArray.push({ id: key, ...data[key] });
        }
        setRows(bookArray);
        addKeys(data);
      })
      .catch(err => console.error(err));
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', {value: keys[index]}));
    setBook(valueKeys);
  }

  const addTodo = (newTodo) => {
    fetch('https://bookstore-3dc80-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
      {
        method: 'POST',
        body: JSON.stringify(newTodo)
      })
      .then(response => fetchBooks())
      .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-3dc80-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: 'DELETE',
      })
      .then(response => {
        const filteredRows = rows.filter(row => row.id !== id);
        setRows(filteredRows);
      })
      .catch(err => console.error(err))
  }

  const deleteAll = () => {
    fetch(`https://bookstore-3dc80-default-rtdb.europe-west1.firebasedatabase.app/books/.json`, {
      method: 'DELETE',
    })
    .then(response => {
      setRows([]);
    })
    .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchBooks();
  }, [])

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <Button variant="outlined" color="primary" onClick={deleteAll}>
            Clear
          </Button>
      <AddTodo addTodo={addTodo} />
      <div style={{ height: 400, width: '100%'}}>
        <DataGrid rows={rows} columns={columns} rowHeight={40} getRowId={(row) => row.id} />
      </div>
    </div>
  );
}

export default App;