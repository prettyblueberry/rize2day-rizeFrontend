import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonPrimary, { ButtonPrimaryProps } from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";

export interface FollowButtonProps extends ButtonPrimaryProps {
  isFollowing?: boolean;
  onTogglefollow?: any,
  afterExcute?: any
}

const FollowButton: FC<FollowButtonProps> = ({
  className = "relative z-10",
  sizeClass = "px-4 py-1.5 min-w-[84px]",
  fontSize = "text-sm font-medium",
  isFollowing = Math.random() > 0.5,
  onTogglefollow,
  afterExcute
}) => {
  const [following, setFollowing] = React.useState(isFollowing);
  const { userId } = useParams();

  return !following ? (
    <ButtonPrimary
      className={className}
      sizeClass={sizeClass}
      fontSize={fontSize}
      onClick={() => { setFollowing(true); onTogglefollow(userId || ""); afterExcute && setTimeout(() => afterExcute(), 1000); }}
    >
      Follow
    </ButtonPrimary>
  ) : (
    <ButtonSecondary
      className={className}
      sizeClass={sizeClass}
      fontSize={fontSize}
      onClick={() => { setFollowing(false); onTogglefollow(userId || ""); afterExcute && setTimeout(() => afterExcute(), 1000);}}
    >
      <span className="text-sm ">Following</span>
    </ButtonSecondary>
  );
};

export default FollowButton;
