const Search = ({ value, onChange }) => {
  return (
    <div>
      find countries <input type="text" value={value} onChange={onChange} />
    </div>
  );
};

export default Search;
