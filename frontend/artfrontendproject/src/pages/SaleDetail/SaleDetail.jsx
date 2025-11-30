import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard/ProductCard';
import './SaleDetail.css';

export default function SaleDetail() {
    const { id } = useParams();
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const res = await axios.get(`https://deployforstudy-1.onrender.com/api/v1/promotions/${id}`);
                setPromotion(res.data);
            } catch (error) {
                console.error("Error fetching promotion:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotion();
    }, [id]);

    if (loading) return <div className="sale-loading">Loading...</div>;
    if (!promotion) return <div className="sale-not-found">Promotion not found</div>;

    return (
        <div className="sale-detail-container">
            {promotion.imageUrl && (
                <div className="sale-banner">
                    <img src={promotion.imageUrl} alt={promotion.name} />
                </div>
            )}
            <div className="sale-header">
                <h1>{promotion.name}</h1>
                <p>{promotion.description}</p>
            </div>

            <div className="sale-products-grid">
                {promotion.products && promotion.products.length > 0 ? (
                    promotion.products.map(product => {
                        const originalPrice = product.minPrice;
                        let promotionalPrice = originalPrice;

                        if (promotion.type === 'PERCENTAGE') {
                            promotionalPrice = originalPrice * (1 - promotion.value / 100);
                        } else if (promotion.type === 'FIXED_AMOUNT') {
                            promotionalPrice = originalPrice - promotion.value;
                        }

                        const productForCard = {
                            ...product,
                            originalPrice: originalPrice,
                            promotionalPrice: promotionalPrice
                        };
                        // console.log("Rendering ProductCard for:", productForCard);
                        return <ProductCard key={product.id} product={productForCard} />;
                    })
                ) : (
                    <p>Không có sản phẩm nào trong chương trình khuyến mãi này.</p>
                )}
            </div>
        </div>
    );
}
