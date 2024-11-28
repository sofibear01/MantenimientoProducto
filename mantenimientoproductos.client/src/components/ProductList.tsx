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
    IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete';
//import VisibilityIcon from '@mui/icons-material/Visibility';
//import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; 
import { jsPDF } from "jspdf"; // Para exportar listado de productos en PDF


import { useNavigate } from 'react-router-dom';
//import { Product } from '../models/Product';

const ProductList = () => {
    const [products, setProducts] = useState([]);
   // const [filteredProducts, setFilteredProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
    const [openSnackbar, setOpenSnackbar] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState("");   
    //const [showInactive, setShowInactive] = useState(false); 
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/Products'); 
            setProducts(response.data);
            //filterProducts(response.data, showInactive); 
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    //const filterProducts = (products: Product[], showInactive: boolean) => {
    //    if (showInactive) {
    //        setFilteredProducts(products); // Si mostramos inactivos, todos los productos se muestran
    //    } else {
    //        const activeProducts = products.filter(product => product.isActive === 'Y');
    //        setFilteredProducts(activeProducts); // Si no, solo los activos
    //    }
    //};

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //Crear nuevo producto
    const handleNewProduct = () => {
        navigate('/product');
    };

    //Editar producto
    const handleEditProduct = (id: string) => {
        navigate(`/product/${id}`); 
    };

    //Baja logica del producto Active = N
    const handleDeleteProduct = async () => {
        if (!selectedProductId) return;

        try {
            const response = await api.delete(`/Products/${selectedProductId}`);
            if (response.status === 200) {
                fetchProducts(); 
                setSnackbarMessage("Producto eliminado con éxito");
                setOpenSnackbar(true); 
            }
        } catch (error) {
            console.error('Error desactivando producto:', error);
        }
        setOpenDialog(false);
    };


    const handleOpenDialog = (id: string) => {
        setSelectedProductId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProductId(null);
    };


    //const toggleShowInactive = () => {
    //    setShowInactive(prev => !prev); // Alternamos el estado de los productos inactivos
    //    filterProducts(products, !showInactive); // Aplicamos el filtro al cambiar el estado
    //};

    // Función para exportar la tabla a PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.text("Listado de Productos", 20, 20); // Título

        // Definir la tabla con los productos
        let y = 30; 

        // Encabezados
        doc.setFontSize(10);
        doc.text("Product ID", 20, y);
        doc.text("Description", 50, y);
        doc.text("Category ID", 90, y);
        doc.text("Stock", 120, y);
        doc.text("Price", 150, y);
        doc.text("Discount", 180, y);
        doc.text("Active", 220, y);
        y += 10; // Espacio entre encabezado y cuerpo de la tabla

        //contenido
        products.forEach((product, index) => {
            doc.text(product.productId, 20, y);
            doc.text(product.productDescription, 50, y);
            doc.text(String(product.categoryProductId), 90, y);
            doc.text(String(product.stock), 120, y);
            doc.text("$" + product.price.toFixed(2), 150, y);
            doc.text(product.haveEcDiscount === 'Y' ? "Yes" : "No", 180, y);
            doc.text(product.isActive === 'Y' ? "Yes" : "No", 220, y);
            y += 10; // Aumentamos la altura de la fila
        });

        doc.save('productos.pdf');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#e3f2fd', padding: '20px' }}>
            <Typography variant="h4" component="h1" className="form-title">
                Listado de productos
            </Typography>

            <div
                style={{
                    height: '2px', 
                    background: 'linear-gradient(to right, #42a5f5, #1565c0)',
                    borderRadius: '999px',
                    margin: '16px auto',
                    width: '90%',
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
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                    {/*<IconButton*/}
                    {/*    onClick={toggleShowInactive}*/}
                    {/*    sx={{*/}
                    {/*        backgroundColor: '#f57c00',*/}
                    {/*        color: '#fff',*/}
                    {/*        marginRight: '10px',*/}
                    {/*        '&:hover': {*/}
                    {/*            backgroundColor: '#e64a19',*/}
                    {/*        },*/}
                    {/*        width: '40px',*/}
                    {/*        height: '40px',*/}
                    {/*        borderRadius: '4px', */}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    {showInactive ? <VisibilityOffIcon /> : <VisibilityIcon />}*/}
                    {/*</IconButton>*/}
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
                        onClick={handleExportPDF}
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


                {/* para mostrar mensaje de éxito */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <TableContainer
                    component={Paper}
                    style={{
                        width: '100%', 
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
                                                onClick={() => handleOpenDialog(product.productId)}
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

                {/* Dialog de confirmación */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirmación</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            ¿Estás seguro de que deseas desactivar este producto?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            No
                        </Button>
                        <Button onClick={handleDeleteProduct} color="secondary">
                            Sí
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );

};

export default ProductList;
