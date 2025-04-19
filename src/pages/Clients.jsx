import React, { useState } from 'react'
import ModalButton from '../partials/components/ModalButton'
import ClientTable from '../partials/sections/ClientTable'
import { useClients } from '../contexts/ClientsContext'
import AddClientModal from '../partials/modals/AddClientModal'
import Modal from '../partials/sections/Modal'
import EditClientModal from '../partials/modals/EditClientModal'

const Clients = () => {
  const { clients, deleteClient } = useClients()
  const [showEditClientModal, setShowEditClientModal] = useState(false)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const handleEditClientClick = (client) => {
    setSelectedClient(client)
    setShowEditClientModal(true)
  }

  return (
    <div id="clients">
      <div className="page-header">
        <h1 className="h2">Clients</h1>
        <ModalButton type="add" target="#addClientModal" text="Add Client" onClick={() => { setShowAddClientModal(true) }} />
      </div>
      <div className="client-page-body">
        <div className="container">
          <table className="client table">
            <thead className="table-header">
              <tr>
                <th><input type="checkbox" /></th>
                <th>Customer Name</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="table-row">
              {clients.length > 0 ? (
                clients.map(client => (
                  <ClientTable
                    key={client.id}
                    client={client}
                    onEditClick={handleEditClientClick}
                    onDeleteClick={deleteClient} />
                ))
              ) : (
                <tr>
                  <td colSpan="7">No clients available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAddClientModal && (
        <Modal title="Add Client" onClose={() => setShowAddClientModal(false)}>
          <AddClientModal onClose={() => setShowAddClientModal(false)} clients={clients} />
        </Modal>
      )}
      {showEditClientModal && selectedClient && (
        <Modal title="Edit Client" onClose={() => setShowEditClientModal(false)}>
          <EditClientModal client={selectedClient} onClose={() => setShowEditClientModal(false)} />
        </Modal>
      )}
    </div>
  )
}

export default Clients