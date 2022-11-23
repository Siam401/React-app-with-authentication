import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom'

export default function List() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([])
  const [id, setId] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [validationError, setValidationError] = useState({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    await axios.get(`http://lara-react-crud.local/api/products`).then(({ data }) => {
      setProducts(data)
    })
  }

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('title', title)
    formData.append('description', description)

    if (id == 0) {
      formData.append('image', image)

      await axios.post(`http://lara-react-crud.local/api/products`, formData).then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        fetchProducts()
      }).catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors)
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          })
        }
      })
    } else {
      formData.append('_method', 'PATCH');
      if (image !== null) {
        formData.append('image', image)
      }

      console.log(formData.get('image'))

      await axios.post(`http://lara-react-crud.local/api/products/${id}`, formData).then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        })
        fetchProducts()
      }).catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors)
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          })
        }
      })
    }

  }

  const editForm = async (id) => {
    await axios.get(`http://lara-react-crud.local/api/products/${id}`).then(({ data }) => {
      const { title, description } = data.product
      setId(id)
      setTitle(title)
      setDescription(description)
    }).catch(({ response: { data } }) => {
      Swal.fire({
        text: data.message,
        icon: "error"
      })
    })
  }

  const deleteProduct = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      return result.isConfirmed
    });

    if (!isConfirm) {
      return;
    }

    await axios.delete(`http://lara-react-crud.local/api/products/${id}`).then(({ data }) => {
      Swal.fire({
        icon: "success",
        text: data.message
      })
      fetchProducts()
    }).catch(({ response: { data } }) => {
      Swal.fire({
        text: data.message,
        icon: "error"
      })
    })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create Product</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value]) => (
                                <li key={key}>{value}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }

                <Form onSubmit={createProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Name">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} onChange={(event) => {
                          setTitle(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={description} onChange={(event) => {
                          setDescription(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card card-body">
            <div className="table-responsive">
              <table className="table table-bordered mb-0 text-center">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    products.length > 0 && (
                      products.map(
                        (row, key) => (
                          <tr key={key}>
                            <td>{row.title}</td>
                            <td>{row.description}</td>
                            <td>
                              <img width="50px" src={`http://lara-react-crud.local/storage/product/image/${row.image}`} alt="" />
                            </td>
                            <td>
                              <Button className='btn-sm me-2' variant="primary" onClick={() => editForm(row.id)}>
                                Edit
                              </Button>
                              <Button className='btn-sm' variant="danger" onClick={() => deleteProduct(row.id)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        )
                      )
                    )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}