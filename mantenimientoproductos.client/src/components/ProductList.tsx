import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    Button,
    ButtonGroup,
    Toolbar,
} from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/Products'); // Ruta correcta del backend
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleNewProduct = () => {
        console.log('Nuevo producto');
    };

    const handleEditProduct = () => {
        console.log('Editar producto');
    };

    const handleDeleteProduct = () => {
        console.log('Eliminar producto');
    };

    const handleExportProducts = () => {
        console.log('Exportar productos');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Listado de productos
            </Typography>
            <Toolbar>
                <ButtonGroup variant="contained" color="primary" aria-label="actions">
                    <Button onClick={handleNewProduct}>Nuevo</Button>
                    <Button onClick={handleEditProduct}>Editar</Button>
                    <Button onClick={handleDeleteProduct} color="error">Eliminar</Button>
                    <Button onClick={handleExportProducts}>Exportar</Button>
                </ButtonGroup>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Product ID</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Category ID</strong></TableCell>
                            <TableCell><strong>Stock</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Discount</strong></TableCell>
                            <TableCell><strong>Active</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((product) => (
                                <TableRow key={product.productId}>
                                    <TableCell>{product.productId}</TableCell>
                                    <TableCell>{product.productDescription}</TableCell>
                                    <TableCell>{product.categoryProductId}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>${product.price.toFixed(2)}</TableCell>
                                    <TableCell>{product.haveEcDiscount === 'Y' ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{product.isActive === 'Y' ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={products.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
        </div>
    );
};

export default ProductList;
