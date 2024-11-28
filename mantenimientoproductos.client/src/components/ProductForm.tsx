import React, { useState, useEffect } from "react";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Product } from "../models/Product";
import { CategoryProduct } from "../models/CategoryProduct";
import { Snackbar, Alert } from '@mui/material';
import { SelectChangeEvent } from "@mui/material";


const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtener el id de la URL
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product>({
        productId: "",
        productDescription: "",
        categoryProductId: 0,
        stock: 0,
        price: 0,
        haveEcDiscount: "N",
        isActive: "Y",
    });
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");   


    useEffect(() => {
        fetchCategories();

        if (id) {
            fetchProduct(id); // Modo edición
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/ProductCategory");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProduct = async (id: string) => {
        try {
            const response = await api.get(`/Products/${id}`);
            setProduct({
                ...response.data,
                haveEcDiscount: response.data.haveEcDiscount || "N",
                isActive: response.data.isActive || "Y",
            });
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const selectedCategoryId = event.target.value as number;
        setProduct((prev) => ({
            ...prev,
            categoryProductId: selectedCategoryId,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setProduct((prev) => ({ ...prev, [name]: checked ? "Y" : "N" }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!product.productId) newErrors.productId = "El código es obligatorio";
        if (!product.productDescription) newErrors.productDescription = "La descripción es obligatoria";
        if (!product.categoryProductId) newErrors.category = "La categoría es obligatoria";
        if (product.price <= 0) newErrors.price = "El precio debe ser mayor a cero";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let response;
            if (id) {
                // Actualizar producto
                response = await api.put(`/Products/${id}`, product);
                if (response.status === 204) {
                    setSnackbarMessage("Producto actualizado con éxito");
                }
            } else {
                // Crear nuevo producto
                response = await api.post('/Products', product);
                if (response.status === 200) {
                    setSnackbarMessage("Producto agregado con éxito");
                }
            }
            setOpenSnackbar(true);

            setTimeout(() => {
                setOpenSnackbar(false);
                navigate('/'); 
            }, 3000);
        } catch (error) {
            console.error('Error saving product:', error);
            setSnackbarMessage("Ocurrió un error al guardar el producto");
            setOpenSnackbar(true);
            setTimeout(() => {
                setOpenSnackbar(false); 
            }, 3000);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#e3f2fd", padding: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Typography variant="h4" component="h1">
                    {id ? "Editar producto" : "Nuevo producto"}
                </Typography>
                <div
                    style={{
                        height: "2px",
                        background: "linear-gradient(to right, #42a5f5, #1565c0)",
                        borderRadius: "999px",
                        margin: "16px auto",
                        width: "50%",
                    }}
                ></div>
            </div>
            <Box
                component={Paper}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "400px",
                    margin: "0 auto",
                    padding: "30px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <TextField
                    label="Código"
                    name="productId"
                    value={product.productId}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!!id}
                    error={!!errors.productId}
                    helperText={errors.productId}
                />
                <TextField
                    label="Descripción"
                    name="productDescription"
                    value={product.productDescription}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.productDescription}
                    helperText={errors.productDescription}
                />
                <FormControl fullWidth>
                    <InputLabel id="category-label">Categoría</InputLabel>
                    <Select
                        labelId="category-label"
                        value={product.categoryProductId || ''} // Manejo de valor por defecto
                        onChange={handleSelectChange}
                        error={!!errors.category} // Manejo de errores
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.categoryProductId} value={category.categoryProductId}>
                                {category.categoryDescription}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.category && <Typography color="error">{errors.category}</Typography>}
                </FormControl>
                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={product.stock === null || product.stock === undefined ? '' : product.stock}
                    onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                        setProduct((prev) => ({
                            ...prev,
                            stock: value,
                        }));
                    }}
                    fullWidth
                    helperText="Si no se ingresa, el stock será 0"
                />
                <TextField
                    label="Precio Unitario"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Math.max(0, +e.target.value) })}
                    fullWidth
                    error={product.price <= 0}
                    helperText={product.price <= 0 ? "El precio debe ser mayor a cero" : ""}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.haveEcDiscount === "Y"}
                            onChange={handleCheckboxChange}
                            name="haveEcDiscount"
                        />
                    }
                    label="¿Descuento Web?"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.isActive === "Y"}
                            onChange={handleCheckboxChange}
                            name="isActive"
                        />
                    }
                    label="Activo"
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <Button onClick={handleSubmit} sx={{ backgroundColor: "#66bb6a", color: "#fff" }}>
                        Guardar
                    </Button>
                    <Button onClick={() => navigate("/")} sx={{ backgroundColor: "#ef5350", color: "#fff" }}>
                        Cancelar
                    </Button>
                </Box>
            </Box>

            {/* Snackbar para mostrar mensaje de éxito */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
                    Producto agregado con éxito
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductForm;
