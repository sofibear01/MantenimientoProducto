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
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Ícono de edición
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
    const navigate = useNavigate(); // Hook para navegación


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
        navigate('/product/new'); 
    };

    const handleEditProduct = (id: string) => {
        navigate(`/product/edit/${id}`); // Redirige a editar el producto con el ID
    };

    const handleDeleteProduct = () => {
        console.log('Eliminar producto');
    };

    const handleExportProducts = () => {
        console.log('Exportar productos');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#e3f2fd', padding: '20px' }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                style={{ textAlign: 'center', color: '#0d47a1', fontWeight: 'bold' }}
            >
                Listado de productos
            </Typography>
            <div style={{ maxWidth: '90%', margin: '0 auto', paddingTop: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <ButtonGroup variant="contained" aria-label="actions">
                        <Button
                            onClick={handleNewProduct}
                            style={{ backgroundColor: '#42a5f5', color: '#fff', marginRight: '10px' }}
                        >
                            Nuevo
                        </Button>
                        <Button
                            onClick={handleDeleteProduct}
                            style={{ backgroundColor: '#ef5350', color: '#fff', marginRight: '10px' }}
                        >
                            Eliminar
                        </Button>
                        <Button
                            onClick={handleExportProducts}
                            style={{ backgroundColor: '#29b6f6', color: '#fff' }}
                        >
                            Exportar
                        </Button>
                    </ButtonGroup>
                </div>
                <TableContainer
                    component={Paper}
                    style={{
                        maxWidth: '90%',
                        margin: '0 auto',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Table>
                        <TableHead style={{ backgroundColor: '#bbdefb' }}>
                            <TableRow>
                                <TableCell><strong>Product ID</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                <TableCell><strong>Category ID</strong></TableCell>
                                <TableCell><strong>Stock</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Discount</strong></TableCell>
                                <TableCell><strong>Active</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell> {/* Nueva columna */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((product) => (
                                    <TableRow key={product.productId} hover>
                                        <TableCell>{product.productId}</TableCell>
                                        <TableCell>{product.productDescription}</TableCell>
                                        <TableCell>{product.categoryProductId}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.haveEcDiscount === 'Y' ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>{product.isActive === 'Y' ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditProduct(product.productId)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
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
        </div>
    );
};

export default ProductList;
