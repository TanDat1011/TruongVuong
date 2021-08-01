/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
      fetch("http://localhost:1337/categories")
        .then(res => res.json())
          .then(json => {
              setData(json);
          });
  }, [1]);
  return (
    <div>
      {data.map(item => (
        <p>{item.Name}</p>
      ))}
    </div>
  );
};

export default memo(HomePage);
