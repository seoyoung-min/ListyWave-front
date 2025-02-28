'use client';

import * as styles from './BottomSheet.css';
import { MouseEventHandler, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants/queryKeys';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import getCategories from '@/app/_api/category/getCategories';
import createTopic from '@/app/_api/topics/createTopic';
import { CategoryType } from '@/lib/types/categoriesType';
import ArrowDown from '/public/icons/down_chevron.svg';
import useBooleanOutput from '@/hooks/useBooleanOutput';
import Modal from '@/components/Modal/Modal';

interface BottomSheetProps {
  onClose: MouseEventHandler<HTMLDivElement>;
}
// TODO: 하루 요청 3건 제한
function BottomSheet({ onClose }: BottomSheetProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isOn: isModalOn, handleSetOn: openModal, handleSetOff: closeModal } = useBooleanOutput(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //카테고리 불러오기
  const { data: categories } = useQuery<CategoryType[]>({
    queryKey: [QUERY_KEYS.getCategories],
    queryFn: getCategories,
  });

  //생성요청 API 호출
  const createTopicMutation = useMutation({
    mutationFn: () =>
      createTopic({
        categoryKorName: selectedCategory,
        title,
        description,
        isAnonymous,
      }),
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setSelectedCategory('전체');
      setIsAnonymous(false);
      openModal();
    },
    onError: () => {
      setErrorMessage('요청 중 오류가 발생했습니다. 다시 시도해 주세요. :(');
    },
  });

  //드롭다운 바깥쪽 클릭하면 닫히게
  const { ref } = useOnClickOutside(() => {
    setIsDropdownOpen(false);
  });
  const stopPropagation: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  // 리스트 주제(제목) 글자 수 제한 정책
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length > 30) {
      setErrorMessage('리스트 주제를 30자 이내로 작성해주세요.');
    } else {
      setErrorMessage(null);
    }
    setTitle(inputValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.length > 30) {
      return;
    }

    setIsDropdownOpen(false);
    createTopicMutation.mutate();
  };

  return (
    <div className={styles.backGround} onClick={onClose} ref={ref}>
      <div className={styles.bottomsheet} onClick={stopPropagation}>
        <div className={styles.header}>신청하기</div>
        <div className={styles.subText}>관리자 검토 후 노출되며, 정책에 위반될 경우 수정 또는 삭제될 수 있어요.</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.upperWrapper}>
            <div className={styles.selectWrapper}>
              <button type="button" onClick={toggleDropdown} className={styles.categoryButton}>
                <span className={styles.categoryText}>{selectedCategory}</span>
                <ArrowDown alt="카테고리 선택" />
              </button>
              {isDropdownOpen && (
                <ul className={styles.dropdown}>
                  {categories?.map((category) => (
                    <li
                      key={category.code}
                      className={styles.dropdownItem}
                      onClick={() => selectCategory(category.korName)}
                    >
                      {category.korName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.anonymousWrapper}>
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="anonymous" className={styles.checkboxLabel}>
                익명으로 요청하기
              </label>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="보고 싶은 리스트 주제를 입력해 주세요.*"
              value={title}
              onChange={handleTitleChange}
              className={styles.input}
              required
            />
            <input
              type="text"
              placeholder="요청 이유 또는 주제에 대한 설명을 입력해 주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
            />
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={!title || title.length > 30}>
            요청 보내기
          </button>
        </form>
      </div>
      {isModalOn && (
        <Modal handleModalClose={closeModal} size="large">
          <div className={styles.modalText}>{`주제요청이 완료됐어요. 빠르게 검토할게요 :)`} </div>
          <button
            className={styles.modalButton}
            onClick={() => {
              closeModal();
              setIsDropdownOpen(false); //실행안됨
            }}
          >
            닫기
          </button>
        </Modal>
      )}
    </div>
  );
}

export default BottomSheet;
