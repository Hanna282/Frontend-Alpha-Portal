import React, { useState } from 'react'
import ModalButton from '../partials/components/ModalButton'
import MemberCard from '../partials/cards/MemberCard'
import Modal from '../partials/sections/Modal'
import { useMembers } from '../contexts/MembersContext'
import AddMemberModal from '../partials/modals/AddMemberModal'
import EditMemberModal from '../partials/modals/EditMemberModal'

const Members = () => {
  const { members, deleteMember } = useMembers()
  const [showEditMemberModal, setShowEditMemberModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const handleEditMemberClick = (member) => {
    setSelectedMember(member)
    setShowEditMemberModal(true)
  }

  return (
    <div id="members" className="page">
      <div className="page-header">
        <h1 className="h2">Team Members</h1>
        <ModalButton type="add" target="#addMemberModal" text="Add Member" onClick={() => { setShowAddMemberModal(true)}}/> 
      </div>
      <div className="members-list"> 
        {members.length > 0 ? (
          members.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onEditClick={handleEditMemberClick}
              onDeleteClick={deleteMember}
            />
          ))
        ) : (
          <p>No members available.</p>
        )}
      </div>
      {showAddMemberModal && (
          <Modal title="New Member" onClose={() => setShowAddMemberModal(false)}>
            <AddMemberModal onClose={() => setShowAddMemberModal(false)} members={members} />
          </Modal>
        )
      }
      {showEditMemberModal && selectedMember && (
          <Modal title="Edit Member" onClose={() => setShowEditMemberModal(false)}>
            <EditMemberModal member={selectedMember} onClose={() => setShowEditMemberModal(false)} />
          </Modal>
        )
      }
    </div >
  )
}

export default Members 