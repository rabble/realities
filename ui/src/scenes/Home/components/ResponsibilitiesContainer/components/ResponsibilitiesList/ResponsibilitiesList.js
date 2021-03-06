import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import colors from 'styles/colors';
import RealizersMissingIcon from 'components/RealizersMissingIcon';
import _ from 'lodash';

const ResponsibilitiesListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const SelectedResponsibilitiesListGroup = styled(ListGroup)`
  margin-bottom: 0.5rem;
`;

const ResponsibilitiesListGroupHeader = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: ${colors.responsibility};
    border-color: ${colors.responsibility};
    color: white;
  }
`;

const ResponsibilitiesListGroupItem = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: white;
    border-color: ${colors.responsibility};
    color: ${colors.responsibility};
  }
`;

const renderMissingRealizerIcon = (responsibility) => {
  if (!responsibility.realizer) {
    return <RealizersMissingIcon />;
  }
  return '';
};

const ResponsibilitiesList = ({
  selectedResponsibilityId,
  responsibilities,
  subscribeToResponsibilitiesEvents,
}) => {
  const history = useHistory();
  const { orgSlug, needId } = useParams();

  useEffect(() => subscribeToResponsibilitiesEvents(), [subscribeToResponsibilitiesEvents]);

  const sortedResponsibilities = _.orderBy(responsibilities, [(r) => {
    if (r.title) return r.title.toLowerCase();
    return '';
  }], ['asc']);
  return (
    <div>
      {sortedResponsibilities
        .filter((responsibility) => responsibility.nodeId === selectedResponsibilityId)
        .map((responsibility) => (
          <SelectedResponsibilitiesListGroup key={1}>
            <ResponsibilitiesListGroupHeader
              active
            >
              {responsibility.title}
              {renderMissingRealizerIcon(responsibility)}
            </ResponsibilitiesListGroupHeader>
          </SelectedResponsibilitiesListGroup>
        ))}
      <ResponsibilitiesListGroup>
        {sortedResponsibilities.map((responsibility) => (
          <ResponsibilitiesListGroupItem
            key={responsibility.nodeId}
            tag="button"
            href="#"
            action
            active={responsibility.nodeId === selectedResponsibilityId}
            onClick={() => history.push(`/${orgSlug}/${needId}/${responsibility.nodeId}`)}
          >
            {responsibility.title}
            {renderMissingRealizerIcon(responsibility)}
          </ResponsibilitiesListGroupItem>
        ))}
      </ResponsibilitiesListGroup>
    </div>
  );
};

ResponsibilitiesList.propTypes = {
  subscribeToResponsibilitiesEvents: PropTypes.func.isRequired,
  responsibilities: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  })),
  selectedResponsibilityId: PropTypes.string,
};

ResponsibilitiesList.defaultProps = {
  responsibilities: [],
  selectedResponsibilityId: undefined,
};

export default ResponsibilitiesList;
