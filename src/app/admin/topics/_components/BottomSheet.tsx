'use client';

import * as styles from './BottomSheet.css';
import { MouseEventHandler, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants/queryKeys';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import getCategories from '@/app/_api/category/getCategories';
import editAdminTopic from '@/app/_api/adminTopics/editAdminTopic';

import { CategoryType } from '@/lib/types/categoriesType';
import ArrowDown from '/public/icons/down_chevron.svg';

interface BottomSheetProps {
  onClose: () => void;
  topicTitle: string;
  category: string;
  isExposed: boolean;
  topicId: number;
}
// TODO: 컴포넌트 공통화 작업
function BottomSheet({ onClose, topicTitle, category, isExposed, topicId }: BottomSheetProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(topicTitle);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //카테고리 불러오기
  const { data: categories } = useQuery<CategoryType[]>({
    queryKey: [QUERY_KEYS.getCategories],
    queryFn: getCategories,
  });

  const convertCategoryKorNameToCode = (korName: string) => {
    const category = categories?.find((cat) => cat.korName === korName);
    return category ? category.code : null; // 찾지 못하면 null 반환
  };

  const editTopicMutation = useMutation({
    mutationFn: () =>
      editAdminTopic({
        topicId,
        isExposed,
        title,
        categoryCode: convertCategoryKorNameToCode(selectedCategory as string) || '',
      }),
    onSuccess: () => {
      setTitle('');
      setSelectedCategory(selectedCategory);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getAdminTopics],
      });
      onClose();
    },
    onError: (error) => {
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
    editTopicMutation.mutate();
  };

  return (
    <div className={styles.backGround} onClick={onClose} ref={ref}>
      <div className={styles.bottomsheet} onClick={stopPropagation}>
        <div className={styles.header}>수정하기</div>
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
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="수정하고 싶은 제목으로 입력해 주세요.*"
              value={title}
              onChange={handleTitleChange}
              className={styles.input}
              required
            />
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={!title || title.length > 30}>
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default BottomSheet;
