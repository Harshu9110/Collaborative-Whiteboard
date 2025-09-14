const UserCursors = ({ cursors }) => {
  return (
    <div className="user-cursors">
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="user-cursor"
          style={{
            left: cursor.x,
            top: cursor.y,
            backgroundColor: cursor.color || "#FF6B6B",
          }}
        />
      ))}
    </div>
  )
}

export default UserCursors
