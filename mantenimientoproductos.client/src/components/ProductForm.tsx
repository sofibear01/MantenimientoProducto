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
        if (!product.code) newErrors.code = 'El código es obligatorio';
        if (!product.description) newErrors.description = 'La descripción es obligatoria';
        if (!product.category) newErrors.category = 'La categoría es obligatoria';
        if (!product.price) newErrors.price = 'El precio es obligatorio';

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
        <Box
            component={Paper}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: '400px',
                margin: '50px auto',
                padding: '30px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h5" component="h1" sx={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
                {productId ? 'Editar Producto' : 'Nuevo Producto'}
            </Typography>
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
                onChange={handleInputChange}
                fullWidth
            />
            <TextField
                label="Precio Unitario"
                name="price"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                fullWidth
                error={!!errors.price}
                helperText={errors.price}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={product.webDiscount}
                        onChange={handleCheckboxChange}
                        name="webDiscount"
                    />
                }
                label="¿Descuento Web?"
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
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Guardar
                </Button>
                <Button variant="outlined" onClick={onClose}>
                    Cancelar
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;
