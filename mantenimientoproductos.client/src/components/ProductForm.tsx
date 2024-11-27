import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


const ProductForm = ({ productId, onClose }: { productId?: string; onClose: () => void }) => {
    const [product, setProduct] = useState({
        code: '',
        description: '',
        category: '',
        stock: 0,
        price: 0,
        webDiscount: false,
        active: true,
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        fetchCategories();

        if (productId) {
            fetchProduct(productId);
        }
    }, [productId]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/ProductCategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProduct = async (id: string) => {
        try {
            const response = await api.get(`/Products/${id}`);
            setProduct({
                ...response.data,
                webDiscount: response.data.haveEcDiscount === 'Y',
                active: response.data.isActive === 'Y',
            });
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setProduct((prev) => ({ ...prev, category: e.target.value as string }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setProduct((prev) => ({ ...prev, [name]: checked }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Campos obligatorios
        if (!product.code) newErrors.code = 'El código es obligatorio';
        if (!product.description) newErrors.description = 'La descripción es obligatoria';
        if (!product.category) newErrors.category = 'La categoría es obligatoria';
        if (!product.price || product.price <= 0) {
            newErrors.price = 'El precio es obligatorio y debe ser mayor a 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            if (productId) {
                await api.put(`/Products/${productId}`, product);
            } else {
                await api.post('/Products', product);
            }
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#e3f2fd', padding: '20px' }}>
            {/* Contenedor del título y la línea degradada */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Typography
                    variant="h4" component="h1" className="form-title"
                >
                    {productId ? 'Editar producto' : 'Nuevo producto'}
                </Typography>

                <div
                    style={{
                        height: '2px',
                        background: 'linear-gradient(to right, #42a5f5, #1565c0)',
                        borderRadius: '999px',
                        margin: '16px auto',
                        width: '50%',
                    }}
                ></div>
            </div>

            {/* Caja del formulario */}
            <Box
                component={Paper}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '400px',
                    minHeight: '400px',
                    margin: '0 auto',
                    padding: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Blanco con transparencia
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <TextField
                    label="Código"
                    name="code"
                    value={product.code}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={!!productId}
                    error={!!errors.code}
                    helperText={errors.code}
                />
                <TextField
                    label="Descripción"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description}
                />
                <FormControl fullWidth>
                    <InputLabel id="category-label">Categoría</InputLabel>
                    <Select
                        labelId="category-label"
                        value={product.category}
                        onChange={handleSelectChange}
                        error={!!errors.category}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.category && <Typography color="error">{errors.category}</Typography>}
                </FormControl>
                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value)); // Solo valores positivos
                        setProduct((prev) => ({ ...prev, stock: value }));
                    }}
                    fullWidth
                    helperText="El stock debe ser un valor positivo"
                />
                <TextField
                    label="Precio Unitario"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value)); 
                        setProduct((prev) => ({ ...prev, price: value }));
                    }}
                    fullWidth
                    error={product.price <= 0} 
                    helperText={product.price <= 0 ? "El precio unitario debe ser mayor a cero" : ""} 
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.webDiscount}
                            onChange={handleCheckboxChange}
                            name="webDiscount"
                        />
                    }
                    label="¿Descuento web?"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.active}
                            onChange={handleCheckboxChange}
                            name="active"
                        />
                    }
                    label="Activo"
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Button
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: '#66bb6a',
                            color: '#fff',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#57a05b',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        Guardar
                    </Button>
                    <Button
                        onClick={() => navigate('/')} 
                        sx={{
                            backgroundColor: '#ef5350',
                            color: '#fff',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </div>
    );

};

export default ProductForm;
