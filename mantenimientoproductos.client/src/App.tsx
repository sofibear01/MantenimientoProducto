import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList'; 

function App() {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/product/new" element={<ProductForm />} />
                <Route path="/product/edit/:id" element={<ProductForm />} />
            </Routes>
        </div>
    );
}

export default App;
