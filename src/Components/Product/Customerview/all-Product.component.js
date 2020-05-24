import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Col, Card, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import ImageSlider from "../subcomponents/ImageSlider";
import CheckBox from "../subcomponents/CheckBox";
import RadioBox from "../subcomponents/RadioBox";
import { productBranches, productPrice } from "../subcomponents/Datas";
import SearchFeature from "../subcomponents/SearchFeature";
import { serverUrl } from "../../config";

const { Meta } = Card;
const { Text } = Typography;

function AllProductComponent() {

    const [Filters, setFilters] = useState({
        productBranches: [],
        productPrice: [],
    });

    const [SearchTerms, setSearchTerms] = useState("");

    const [Products, setProducts] = useState([]);

    useEffect(() => {
        const variables = {

        };

        getProducts(variables);

    }, []);

    const getProducts = (variables) => {
        Axios.post(serverUrl + "/products/getProducts", variables).then(
            (response) => {
                if (response.data.success) {
                    setProducts(response.data.products);

                } else {
                    alert("Failed to fectch product datas");
                }

            }
        );
    };

    const renderCards = Products.map((product, index) => {
        return (
            <Col key={product._id} lg={6} md={8} xs={24}>
                <Card
                    hoverable={true}
                    cover={
                        <Link to={"/productDetails/" + product._id}>
                            <ImageSlider images={product.images} />
                        </Link>
                    }
                >
                    <Meta
                        title={product.productName}
                        description={`Rs.${product.productPrice}.00`}
                    />
                    <div className="additional">
                        <Text type="warning">{product.productDiscount}% Discount</Text>
                        <br />
                        <Text type="secondary">{product.productQnt} items available</Text>
                    </div>

                </Card>
            </Col>
        );
    });

    const showFilteredResults = (filters) => {
        const variables = {
            filters: filters,
            searchTerm: SearchTerms,
        };

        getProducts(variables);
    };

    const handlePrice = (value) => {
        const data = productPrice;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }

        return array;
    };

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters };
        newFilters[category] = filters;

        if (category === "productPrice") {
            let priceValues = handlePrice(filters);
            newFilters[category] = priceValues;
        }

        showFilteredResults(newFilters);
        setFilters(newFilters);
    };

    const updateSearchTerms = (newSearchTerm) => {
        const variables = {
            filters: Filters,
            searchTerm: newSearchTerm,
        };

        setSearchTerms(newSearchTerm);

        getProducts(variables);
    };

    return (
        <div style={{ width: "75%", margin: "3rem auto", marginTop: 70 }}>
            <div style={{ textAlign: "center" }}>
                <h2> All Products</h2>
            </div>

            {/* Filter  */}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    <CheckBox
                        list={productBranches}
                        handleFilters={(filters) =>
                            handleFilters(filters, "productBranches")
                        }
                    />
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox
                        list={productPrice}
                        handleFilters={(filters) => handleFilters(filters, "productPrice")}
                    />
                </Col>
            </Row>

            {/* Search */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "1rem auto",
                }}
            >
                <SearchFeature refreshFunction={updateSearchTerms} />
            </div>

            {/* Product card view  */}
            {Products.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        height: "300px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h2>No product yet...</h2>
                </div>
            ) : (
                <div>
                    <Row gutter={[16, 16]}>{renderCards}</Row>
                </div>
            )}
            <br />
            <br />
        </div>
    );
}

export default AllProductComponent;
