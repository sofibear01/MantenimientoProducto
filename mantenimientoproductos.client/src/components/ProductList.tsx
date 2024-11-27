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
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete';

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
        navigate('/product'); // Redirige a la ruta para crear un nuevo producto
    };

    const handleEditProduct = (id: string) => {
        navigate(`/product/${id}`); // Redirige a la ruta para editar un producto específico
    };

    const handleDeleteProduct = () => {
        console.log('Eliminar producto');
    };

    const handleExportProducts = () => {
        console.log('Exportar productos');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#e3f2fd', padding: '20px' }}>
            <Typography variant="h4" component="h1" className="form-title">
                Listado de productos
            </Typography>

            <div
                style={{
                    height: '2px', // Grosor de la línea
                    background: 'linear-gradient(to right, #42a5f5, #1565c0)',
                    borderRadius: '999px',
                    margin: '16px auto',
                    width: '90%', // Línea horizontal centrada
                }}
            ></div>

            {/* Contenedor padre común */}
            <div
                style={{
                    maxWidth: '90%',
                    margin: '0 auto',
                    paddingTop: '20px',
                }}
            >
                {/* Contenedor para los botones */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Alinea los botones a la derecha
                        marginBottom: '20px',
                        width: '100%',
                    }}
                >
                    <Button
                        onClick={handleNewProduct}
                        sx={{
                            backgroundColor: '#66bb6a',
                            color: '#fff',
                            marginRight: '10px',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#57a05b',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        Nuevo
                    </Button>
                    <Button
                        onClick={handleExportProducts}
                        sx={{
                            backgroundColor: '#29b6f6',
                            color: '#fff',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#2196f3',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        Exportar
                    </Button>
                </div>

                {/* Contenedor para la tabla */}
                <TableContainer
                    component={Paper}
                    style={{
                        width: '100%', // Ocupa todo el ancho disponible para coincidir con los botones
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
                                <TableCell><strong>Actions</strong></TableCell>
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
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteProduct(product.productId)}
                                            >
                                                <DeleteIcon />
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
